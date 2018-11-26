import User from '../../models/user/user.model';
import Joi from 'joi';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const registerSchema = Joi.object().keys({
    first_name: Joi.string().required().trim(),
    last_name: Joi.string().required().trim(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{6, 32}$/).required().trim()
});

const loginSchema = Joi.object.keys({
    email: Joi.string().email().required().trim(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{6, 32}$/).required().trim()
})

module.exports = {
    Register:async(req, res, next)=>{
        try{
            const {error, value} = await Joi.validate(req.body, registerSchema);
            const {email} = req.body;
            if(!error){
                const result = await User.findOne({email}).exec();
                if(result){
                    return next(null, false, {message: 'User with the same email already exist***'});
                }
                let user = await User.create(req.body);
                user = await user.responseObject();
                res.status(httpStatus.CREATED).json({user});

            }
            return next(error);
        }catch(err){
            next(err);
        }
    },
    Login: async (req, res, next)=>{
        passport.authenticate('local', {session: false}, (err, user, info)=>{
            try{
                if(err || !user){
                    const errorMsg = new Error('An Error occured during login***');
                    return next(errorMsg);
                }
                const {error, value} = await Joi.validate(req.body, loginSchema);
                if(!error){
                    req.login(user, {session: false}, async(errObj)=>{
                        if(errObj){
                            return next(errObj);
                        }
                        const {_id, first_name, last_name, email} = user;
                        const data = {_id, first_name, last_name, email};
                        const token = await jwt.sign({data}, process.env.SECRET, {expiresIn: '1d'});
                        return res.status(httpStatus.OK).json({user: data, token});
                    });
                }
                return next(error);
            }catch(err){
                next(err);
            }
        })(req, res);
       
    }
}
