"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const myRestaurantController = __importStar(require("../controllers/myRestaurantController"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, //5mb
    },
});
router.get("/order", auth_1.jwtCheck, auth_1.jwtParse, myRestaurantController.getMyRestaurantOrder);
router.patch("/order/:orderId/status", auth_1.jwtCheck, auth_1.jwtParse, myRestaurantController.updateOrderStatus);
router.get("/", auth_1.jwtCheck, auth_1.jwtParse, myRestaurantController.getMyRestaurant);
router.post("/", upload.single("imageFile"), auth_1.jwtCheck, auth_1.jwtParse, validation_1.validateMyRestaurantRequest, myRestaurantController.createMyRestaurant);
router.put("/", upload.single("imageFile"), auth_1.jwtCheck, auth_1.jwtParse, validation_1.validateMyRestaurantRequest, myRestaurantController.updateMyRestaurant);
exports.default = router;
