exports.CommonError = class {
  constructor(error, status) {
    console.error(error);

    this.name = error.name;
    this.message = error.message;
    this.status = status;
  }
};
