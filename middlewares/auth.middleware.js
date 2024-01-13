import CustomErrorHandler from "../services/CustomErrorHandler.js";
import JwtService from "../services/JwtService.js";

const auth = async (req, res, next) => {
  let authHeader = req.headers.authorization;
  // console.log('auth middleware', authHeader)
  if (!authHeader) {
    return next(CustomErrorHandler.unAuthorizedUser());
  }
  let token = authHeader.split(" ")[1];
  console.log(token);
  try {
    const { _id, role } = JwtService.verify(token);
    const user = { _id: _id, role: role };
    //  console.log(user);
    req.user = user;
    next();
  } catch (error) {
    return next(CustomErrorHandler.unAuthorizedUser());
  }
};

export default auth;
