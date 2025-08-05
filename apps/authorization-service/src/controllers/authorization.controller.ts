import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthorizationService } from '../services/authorization.service';
import { RegistrationDto } from "../dto/request/registration.dto";
import { AuthorizationResponseDto } from "../dto/response/authorization-response.dto";
import { LoginDto } from "../dto/request/login.dto";

@Controller('authorization')
export class AuthorizationController {
    constructor(private readonly authorizationServiceService: AuthorizationService) {}

        @Post('registration')
    async registration(@Body() registrationDto: RegistrationDto): Promise<AuthorizationResponseDto> {
        return this.authorizationServiceService.registration(registrationDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<AuthorizationResponseDto> {
        return this.authorizationServiceService.login(loginDto);
    }
}
