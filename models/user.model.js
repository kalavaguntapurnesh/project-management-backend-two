const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
    },
    gender: {
      type: Object,
    },
    selectedCountry: {
      type: Object,
    },
    selectedState: {
      type: Object,
    },
    selectedCity: {
      type: Object,
    },
    streetName: {
      type: String,
      default: "",
    },
    postalCode: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
