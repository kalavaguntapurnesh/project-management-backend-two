const express = require("express");
const userController = require("../controllers/user.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/registerUser", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/updateProfile", authMiddleware, userController.updateProfile);
router.get("/confirm/:token", userController.confirmToken);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword/:id/:token", userController.resetPassword);
router.post("/getUserData", authMiddleware, userController.getUserData);
router.post("/addProperty", authMiddleware, userController.addProperty);
router.post("/getProperties", authMiddleware, userController.getProperty);

module.exports = router;