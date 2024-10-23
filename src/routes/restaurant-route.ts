import express from "express";
import { param } from "express-validator";
import * as restaurantController from "../controllers/restaurantController";

const router = express.Router();

//  /api/restaurant/...
router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter is required"),
  restaurantController.searchRestaurants
);

router.get("/all", restaurantController.getRestaurants);

router.get(
  "/:restaurantId",
  param("restaurantId")
    .notEmpty()
    .isString()
    .trim()
    .withMessage("Restraurant Id parameter is required"),
  restaurantController.getRestaurant
);

export default router;
