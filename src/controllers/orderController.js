"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = exports.stripeWebhookHandler = exports.getMyOrder = void 0;
const stripe_1 = __importDefault(require("stripe"));
const restaurant_1 = __importDefault(require("../models/restaurant"));
const order_1 = __importDefault(require("../models/order"));
const STRIPE = new stripe_1.default(process.env.STRIPE_API_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const getMyOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_1.default.find({ user: req.userId })
            .populate("restaurant")
            .populate("user");
        return res.status(200).json(orders);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getMyOrder = getMyOrder;
const stripeWebhookHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let event;
    try {
        const sig = req.headers["stripe-signature"];
        event = STRIPE.webhooks.constructEvent(req.body, sig, STRIPE_ENDPOINT_SECRET);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(`Webhook error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
        const order = yield order_1.default.findById((_a = event.data.object.metadata) === null || _a === void 0 ? void 0 : _a.orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.totalAmount = event.data.object.amount_total;
        order.status = "paid";
        yield order.save();
    }
    res.status(200).send();
});
exports.stripeWebhookHandler = stripeWebhookHandler;
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkoutSessionRequest = req.body;
        const restaurant = yield restaurant_1.default.findById(checkoutSessionRequest.restaurantId);
        if (!restaurant) {
            throw new Error("Restaurant not found");
        }
        const newOrder = new order_1.default({
            restaurant: restaurant,
            user: req.userId,
            status: "placed",
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            createdAt: new Date(),
        });
        const lineItems = createLineItems(checkoutSessionRequest, restaurant.menuItems);
        const session = yield createSession(lineItems, newOrder._id.toString(), restaurant.deliveryPrice, restaurant.id.toString());
        if (!session.url) {
            return res.status(500).json({ message: "Error creating stripe session" });
        }
        yield newOrder.save();
        return res.json({ url: session.url });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.raw.message });
    }
});
exports.createCheckoutSession = createCheckoutSession;
const createLineItems = (checkoutSessionRequest, menuItems) => {
    //  1. for each createLineItems, get the menuItem object from the restaurant(to get the price)
    //  2. foreach cartItem, conver it to a stripe line lineItems
    //  3. return line item array
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item) => item._id.toString() === cartItem.menuItemId.toString());
        if (!menuItem) {
            throw new Error(`Menu Item not found: ${cartItem.name}`);
        }
        const line_item = {
            price_data: {
                currency: "inr",
                unit_amount: parseInt(menuItem.price),
                product_data: {
                    name: menuItem.name,
                },
            },
            quantity: parseInt(cartItem.quantity),
        };
        return line_item;
    });
    return lineItems;
};
const createSession = (lineItems, orderId, deliveryPrice, restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionData = yield STRIPE.checkout.sessions.create({
        line_items: lineItems,
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: "Delivery",
                    type: "fixed_amount",
                    fixed_amount: {
                        amount: deliveryPrice,
                        currency: "inr",
                    },
                },
            },
        ],
        mode: "payment",
        metadata: {
            orderId,
            restaurantId,
        },
        success_url: `${FRONTEND_URL}/order-status?success=true`,
        cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
    });
    return sessionData;
});
