import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: errors.array() });
  }

  next();
};

export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Name must be a string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("Address line 1 must be a string"),
  body("city").isString().notEmpty().withMessage("City must be a string"),
  body("country").isString().notEmpty().withMessage("Country must be a string"),
  handleValidationErrors,
];

export const validateMyRestaurantRequest = [
  body("restaurantName").notEmpty().withMessage("Restaurant name is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("deliveryPrice")
    .isInt({ min: 1 })
    .withMessage("Delivery price is required"),
  body("estimatedDeliveryTime")
    .isInt({ min: 1 })
    .withMessage("Delivery time is required"),
  body("cuisines")
    .isArray()
    .withMessage("Cuisines mut be an array")
    .not()
    .isEmpty()
    .withMessage("Cuissines array cannot be empty"),
  body("menuItems").isArray().withMessage("Menu items must be an array"),
  body("menuItems.*.name").notEmpty().withMessage("Menu item name is required"),
  body("menuItems.*.price")
    .isInt({ min: 1 })
    .withMessage("Menu item price is required"),
  body("menuItems.*.description")
    .isString()
    .notEmpty()
    .withMessage("menu item description is required"),
  handleValidationErrors,
];
