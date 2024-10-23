import express from "express";
import multer from "multer";
import * as myRestaurantController from "../controllers/myRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

router.get(
  "/order",
  jwtCheck,
  jwtParse,
  myRestaurantController.getMyRestaurantOrder
);

router.patch(
  "/order/:orderId/status",
  jwtCheck,
  jwtParse,
  myRestaurantController.updateOrderStatus
);

router.get("/", jwtCheck, jwtParse, myRestaurantController.getMyRestaurant);

router.post(
  "/",
  upload.single("imageFile"),
  jwtCheck,
  jwtParse,
  validateMyRestaurantRequest,
  myRestaurantController.createMyRestaurant
);

router.put(
  "/",
  upload.single("imageFile"),
  jwtCheck,
  jwtParse,
  validateMyRestaurantRequest,
  myRestaurantController.updateMyRestaurant
);

export default router;
