import { Schema, model, models } from "mongoose";

const stripeInvoiceSchema = new Schema({
  created: {
    type: Number,
  },
  amount: {
    type: Number,
  },
  description: {
    type: String,
  },
  id: {
    type: String,
  },
  invoice: {
    type: String,
  },
  status: {
    type: String,
  },
});

const visitSchema = new Schema({
  visitStartDate: {
    type: String,
    required: true,
  },
  visitEndDate: {
    type: String,
    required: true,
  },
  service: {
    type: [String],
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  // Inne pola związane z wizytą
});

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Email already exists!"],
    required: [true, "Email is required"],
  },
  username: {
    type: String,
    required: false,
  },
  image: {
    type: String,
  },
  plan: {
    type: String,
    default: "free",
  },
  stripeCustomerId: {
    type: String,
    default: "",
  },
  stripeInvoices: {
    type: [stripeInvoiceSchema],
    required: false,
  },
  role: {
    type: String,
    default: "user",
  },
  phone: {
    type: String,
    default: "",
  },
  visits: [visitSchema],
  isVerified: {
    type: Boolean,
    default: false,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  surname: {
    type: String,
    default: "",
  },
});

const User = models.User || model("User", UserSchema);

export default User;