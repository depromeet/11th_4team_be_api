import { ExtractJwt } from 'passport-jwt';

console.log(process.env.JWT_SECRET);
export const JwtStrategyConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: process.env.JWT_SECRET,
};

export const JwtModuleConfig = {
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '12h' },
};
