import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "@app/common/entities/user.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        try {
            console.log(request);
            const [bearer, token] = request.headers.authorization.split(' ');
            if (!token || bearer !== "Bearer") {
                throw new UnauthorizedException();
            }

            const user: UserEntity = await this.jwtService.verify(token, {
                secret: this.configService.get<string>("JWT_SECRET")
            });
            request.user = user;

            return true;
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }
}