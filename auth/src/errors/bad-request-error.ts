import { CustomError} from './custom-error';
export class BadRequestError extends CustomError {
  statusCode = 400;

  // Allow String to be passed in Error: BadRequestError('Email in use')
  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    // reference passed message from instance
    return [{ message: this.message }];
  }
}