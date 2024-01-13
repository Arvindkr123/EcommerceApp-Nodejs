import mongoose from "mongoose";

const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const RefreshTokenModel = mongoose.model("RefreshToken", refreshTokenSchema);
export default RefreshTokenModel;
