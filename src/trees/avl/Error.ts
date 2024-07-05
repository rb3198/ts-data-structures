export enum AVLTreeErrorCode {
  DuplicateKey = 1,
  UnexpectedOperation = 2,
  NotFound = 3,
}

export class AVLTreeError {
  code: AVLTreeErrorCode;
  message?: string;
  constructor(code: AVLTreeErrorCode, message?: string) {
    this.code = code;
    this.message = message;
  }
}
