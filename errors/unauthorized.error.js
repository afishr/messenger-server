exports.UnauthorizedError = class {
  constructor(error) {
    console.error(error);

    this.name = error.name;
    this.message = error.message;
    this.status = 403;
  }
};
