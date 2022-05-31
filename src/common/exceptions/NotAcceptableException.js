const ApiException = require("./ApiException");

class NotAcceptableException extends ApiException {
  constructor(error) {
    super("Not Accepted!", "Your request cannot be accepted!", 406, error);
  }
}

module.exports = NotAcceptableException;