import { Schema, model, models } from "mongoose";

const imagesArraySchema = new Schema({
  uri: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  id: {
    type: String,
  },
});

const ModelSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Użytkownik jest wymagany"],
  },
  modelId: {
    type: String,
    required: true,
  },
  modelName: {
    type: String,
    required: true,
  },
  modelKeyword: {
    type: String,
    required: true,
  },
  creationDate: {
    type: String,
    required: true,
  },
  images: {
    type: [imagesArraySchema],
    required: false,
  },
  previewImages: {
    type: [imagesArraySchema],
    required: false,
  },
  trained: {
    type: String,
    default: "false",
  },
  gender: {
    type: String,
  },
  pickedStyles: {
    type: [],
  },
  versionId: {
    type: String,
  },
  availableImages: {
    type: Number,
    default: 0,
  },
});

const Model = models.Model || model("Model", ModelSchema);

export default Model;