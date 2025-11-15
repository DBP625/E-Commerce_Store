import mongoose from "mongoose";
import bcrypt from "bcryptjs"; //to hash password before saving to database

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"], // Validation: Name must be provided
    },
    email: {
      type: String,
      required: [true, "Email is required"], // Validation: Email must be provided
      unique: true, // Ensure email uniqueness
      lowercase: true, // Store email in lowercase
      trim: true, // Remove whitespace from both ends
    },
    password: {
      type: String,
      required: [true, "Password is required"], // Validation: Password must be provided
      minlength: [6, "Password must be at least 6 characters long"], // Validation: Minimum length
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
          min: [1, "Quantity must be at least 1"], // Validation: Minimum quantity
        },
        product: {
          type: mongoose.Schema.Types.ObjectId, //it means that the product field will store an ObjectId that references a document in another collection.
          ref: "Product", // Reference to the Product model
        },
      },
    ],
    role: {
      type: String,
      enum: ["customer", "admin"], // Role can be either 'user' or 'admin'
      default: "customer", // Default role is 'user'
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    //it means that if the password field has not been modified (for example, when updating other fields like email or name), the middleware will skip the hashing process and
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
//it means that before saving a user document to the database, if the password field has been modified, it will hash the password using bcryptjs with a salt factor of 10.

const User = mongoose.model("User", userSchema);

export default User;
