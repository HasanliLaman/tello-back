const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { reset } = require("nodemon");
const Cart = require("./cart");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      minLength: 5,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      validate: [validator.isEmail, "Please provide correct email."],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minLength: 6,
      maxLength: 10,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm password is required."],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password and Confirm Password should match.",
      },
    },
    address: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetToken: String,
    resetTokenExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  this.wasNew = this.isNew;
  if (!this.isModified("password")) return next();
  const newPassword = await bcrypt.hash(this.password, 12);
  this.password = newPassword;
  this.confirmPassword = undefined;
  next();
});

userSchema.post("save", async function (doc, next) {
  if (!this.wasNew) return next();

  await Cart.create({
    products: [],
    user: doc._id,
  });
  next();
});

userSchema.methods.comparePassword = async (providedPassword, userPassword) => {
  return await bcrypt.compare(providedPassword, userPassword);
};

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(15).toString("hex");
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetToken = hashedResetToken;
  this.resetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("user", userSchema);
module.exports = User;
