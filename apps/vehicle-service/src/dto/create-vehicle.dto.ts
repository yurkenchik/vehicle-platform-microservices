import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateVehicleDto {
    @IsNotEmpty()
    @IsString()
    readonly make: string;

    @IsNotEmpty()
    @IsString()
    readonly model: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1950)
    @Max(new Date().getFullYear())
    readonly year: number;
}