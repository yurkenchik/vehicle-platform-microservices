import { HttpException, HttpStatus } from "@nestjs/common";

export class VehicleNotFoundException extends HttpException {
    constructor() {
        super('Vehicle not found', HttpStatus.NOT_FOUND);
    }
}