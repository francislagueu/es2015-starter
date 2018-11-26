import User from '../../models/user/user.model';
import Joi from 'joi';

const registerSchema = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{6, 32}$/).required()
})

module.exports = {
    Register:async(req, res, next)=>{
        const {error, value} = await Joi.validate(req.body, registerSchema);
        const {email} = req.body;
        if(!error){
            const result = await User.findOne({email}).exec();
            if(result){
                return next(null, false, {message: 'User with the same email already exist***'});
            }
            
        }
    },
    Login: (req, res, next)=>{

    }
}
