import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GenerateTokenDto } from "../dto/request/generate-token.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async generateToken(generateTokenDto: GenerateTokenDto): Promise<string> {
        const { id, email } = generateTokenDto;

        return this.jwtService.sign({ id, email }, {
            secret: this.configService.get<string>('JWT_SECRET'),
        });
    }
}