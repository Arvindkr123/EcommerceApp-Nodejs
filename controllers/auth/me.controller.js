import UserModel from "../../model/user.models.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";

const meController = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ _id: req.user._id });
   //  console.log(user);
    if (!user) {
      return next(CustomErrorHandler.notFound());
    }
    res.send({ user });
  } catch (error) {
    return next(CustomErrorHandler.notFound());
  }
};

export default meController;
