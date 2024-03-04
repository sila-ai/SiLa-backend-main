import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { AuthService, Provider } from "./auth.service";
import { googleConstants } from './constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
{
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            clientID: googleConstants.client_id,
            clientSecret: googleConstants.secret,
            callbackURL: googleConstants.callback_url,
            passReqToCallback: true,
            scope: ['email','profile']
        })
    }

    async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function): Promise<any> {
        try {
            const { name, emails, displayName, photos } = profile

            const user_data = {
                email: emails[0].value,
                displayName: displayName,
                firstName: name.givenName,
                lastName: name.familyName,
                picture: photos[0].value,
            }

            const data: any = await this.authService.validateOAuthLogin(profile.id, accessToken ,user_data, Provider.GOOGLE);
            done(null, data);
        }
        catch (err) {
            done(err, false);
        }
    }
}