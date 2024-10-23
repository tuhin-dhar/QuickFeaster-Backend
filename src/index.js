"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const my_user_routes_1 = __importDefault(require("./routes/my-user-routes"));
const my_restaurant_routes_1 = __importDefault(require("./routes/my-restaurant-routes"));
const restaurant_route_1 = __importDefault(require("./routes/restaurant-route"));
const order_routes_1 = __importDefault(require("./routes/order-routes"));
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
mongoose_1.default
    .connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log("Connected to database"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use("/api/order/checkout/webhook", express_1.default.raw({ type: "*/*" }));
app.use(express_1.default.json());
app.use("/api/my/user", my_user_routes_1.default);
app.use("/api/my/restaurant", my_restaurant_routes_1.default);
app.use("/api/restaurant", restaurant_route_1.default);
app.use("/api/order", order_routes_1.default);
app.listen(9000, () => {
    console.log("Server started at port 9000");
});
