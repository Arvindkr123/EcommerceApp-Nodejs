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
}

export default CustomErrorHandler;
