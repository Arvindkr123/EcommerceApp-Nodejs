import Joi from "joi";
import UserModel from "../../model/user.models.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import bcrypt from "bcrypt";
import JwtService from "../../services/JwtService.js";

const loginController = async (req, res, next) => {
  // validation with help of JOI
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return next(CustomErrorHandler.wrongCredentials());
    }

    // compare the password
    const matchPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!matchPassword) {
      return next(CustomErrorHandler.wrongCredentials());
    }

    // generating token
    const access_token = JwtService.sign({ _id: user._id, role: user.role });
    res.send({ access_token });
  } catch (error) {
    return next(error);
  }
};

export default loginController;
