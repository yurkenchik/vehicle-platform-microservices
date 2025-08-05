import { HttpException, HttpStatus } from "@nestjs/common";

export class PasswordsDontMatchException extends HttpException {
    constructor() {
        super("Passwords don't match", HttpStatus.BAD_REQUEST);
    }
}