import Joi from "joi";
import RefreshTokenModel from "../../model/refresh-token.models.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import JwtService from "../../services/JwtService.js";
import { REFRESH_SECRET } from "../../config/index.js";
import UserModel from "../../model/user.models.js";

const refreshTokenController = async (req, res, next) => {
  const refreshTokenSchema = Joi.object({
    refresh_token: Joi.string().required(),
  });
  const { error } = refreshTokenSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  //database
  let refreshToken;
  try {
    refreshToken = await RefreshTokenModel.findOne({
      token: req.body.refresh_token,
    });
    if (!refreshToken) {
      return next(CustomErrorHandler.unAuthorizedUser("invalid refresh token"));
    }
    // now verify the refresh token
    let userId;
    try {
      const { _id } = JwtService.verify(refreshToken.token, REFRESH_SECRET);
      userId = _id;
    } catch (error) {
      return next(CustomErrorHandler.unAuthorizedUser("Invalid refresh token"));
    }

    // now find the user;
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return next(CustomErrorHandler.unAuthorizedUser("no user found"));
    }

    // now generate the access token and refresh token again
    let access_token = JwtService.sign({ _id: user._id, role: user.role });
    let refresh_token = JwtService.sign(
      { _id: user._id, role: user.role },
      "1y",
      REFRESH_SECRET
    );
    // add refresh token in database
    await RefreshTokenModel.create({ token: refresh_token });
    res.send({ access_token, refresh_token });
  } catch (error) {
    return next(new Error("Something went wrong", error.message));
  }
};

export default refreshTokenController;
