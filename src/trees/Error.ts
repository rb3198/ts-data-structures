export enum TreeErrorCode {
  DuplicateKey = 1,
  BadOperation = 2,
  NotFound = 3,
}

export class TreeError {
  code: TreeErrorCode;
  message?: string;
  constructor(code: TreeErrorCode, message?: string) {
    this.code = code;
    this.message = message;
  }
}
