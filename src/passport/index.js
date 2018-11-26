import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt';
import User from '../models/user/user.model';


    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async(email, password, next)=>{
        try{
            const user = await User.findOne({email});
            if(!user){
                return next(null, false, {message: `User doesn't exist***`});
            }
            const result = await user.validatePassword(password);
            if(!result){
                return next(null, false, {message: 'Wrong input password***'});
            }
            return next(null, user, {message: 'You successfully logged in!!!!'})
        }catch(error){
            next(error);
        }
    }));

    passport.use(new JWTStrategy({
        secretOrKey: process.env.SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async(token, next)=>{
        try{
            if(token.exp > Date.now()){
                return next(null, false, {message: 'Authentication token has expired'});
            }
            return next(null, token.data);
        }catch(error){
            next(error);
        }
    }));
 