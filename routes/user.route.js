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
router.post("/addLandlordLeaseProperty", userController.addLandlordLeaseProperty);
router.get("/getAllActiveProperties", userController.getAllActiveProperties);
router.post("/getLandlordLeaseTerms", userController.getLandlordLeaseDetails)
router.post("/addTenantLeaseAgreement", userController.addTenantLeaseAgreement)
router.post("/getLandlordDetailsInTenantDashboard",userController.getLandlordDetailsInTenantDashboard)
router.post("/updateTenantDetailsInLandlordDashboard",userController.updateTenantDetailsInLandlordDashboard)
router.post("/getLeaseProperty", userController.getLeaseProperty);
module.exports = router;
