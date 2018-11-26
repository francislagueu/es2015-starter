import User from '../../models/user/user.model';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import passport from 'passport';



   const Register = async(req, res, next)=>{
        try{
            const {email} = req.body;
            const result = await User.findOne({email}).exec();
            if(result){
                return next(null, false, {message: 'User with the same email already exist***'});
            }
            let user = await User.create(req.body);
            user = await user.responseObject();
            res.status(httpStatus.CREATED).json({user});
        }catch(err){
            next(err);
        }
    };
    const Login = async (req, res, next)=>{
        passport.authenticate('local', {session: false}, (err, user, info)=>{
            try{
                if(err || !user){
                    const errorMsg = new Error('An Error occured during login***');
                    return next(errorMsg);
                }
 
                req.login(user, {session: false}, async(errObj)=>{
                    if(errObj){
                        return next(errObj);
                    }
                    const {_id, first_name, last_name, email} = user;
                    const data = {_id, first_name, last_name, email};
                    const token = await jwt.sign({data}, process.env.SECRET, {expiresIn: '1d'});
                    return res.status(httpStatus.OK).json({user: data, token});
                });
            }catch(err){
                next(err);
            }
        })(req, res);
       
    };

module.exports = {Register, Login};