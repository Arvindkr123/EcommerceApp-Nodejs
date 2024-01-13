class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super(msg);
    this.status = status;
    this.msg = msg;
  }

  static alreadyExists(message) {
    return new CustomErrorHandler(409, message);
  }

  static wrongCredentials(message = "username or password is wrong") {
    return new CustomErrorHandler(401, message);
  }

  static unAuthorizedUser(message = "unAuthorized") {
    return new CustomErrorHandler(401, message);
  }

  static notFound(message = "404 not found") {
    return new CustomErrorHandler(404, message);
  }
}

export default CustomErrorHandler;
