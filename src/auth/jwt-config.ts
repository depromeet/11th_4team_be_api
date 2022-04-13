import { ExtractJwt } from 'passport-jwt';

const jwtConstants = {
  secret: 'secretKey',
};

export const JwtStrategyConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: jwtConstants.secret,
};

export const JwtModuleConfig = {
  secret: jwtConstants.secret,
  signOptions: { expiresIn: '12h' },
};
