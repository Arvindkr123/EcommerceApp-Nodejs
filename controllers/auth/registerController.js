import Joi from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import UserModel from "../../model/user.models.js";
import bcrypt from "bcrypt";
import JwtService from "../../services/JwtService.js";
import { REFRESH_SECRET } from "../../config/index.js";
import RefreshTokenModel from "../../model/refresh-token.models.js";

const registerController = async (req, res, next) => {
  const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    repeat_password: Joi.ref("password"),
  });

  const { error } = registerSchema.validate(req.body);

  if (error) {
    return next(error);
  }

  try {
    const exist = await UserModel.exists({ email: req.body.email });
    if (exist) {
      return next(CustomErrorHandler.alreadyExists("This email already taken"));
    }
  } catch (error) {
    return next(error);
  }
  const { name, email, password } = req.body;
  const hassedPassword = await bcrypt.hash(password, 10);
  const user = new UserModel({
    name,
    email,
    password: hassedPassword,
  });
  let access_token;
  let refresh_token;
  try {
    const result = await user.save();
    access_token = JwtService.sign({
      _id: result._id,
      role: result.role,
    });
    refresh_token = JwtService.sign(
      {
        _id: result._id,
        role: result.role,
      },
      "1y",
      REFRESH_SECRET
    );
    await RefreshTokenModel.create({ token: refresh_token });
  } catch (error) {
    return next(error);
  }
  res.status(200).send({ access_token, refresh_token });
};

export default registerController;
