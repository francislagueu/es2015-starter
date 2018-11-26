import Joi from 'joi';
import httpStatus from 'http-status';

const ValidateUser = (req, res, next)=>{
    const schema = Joi.object().keys({
        first_name: Joi.string().required().trim(),
        last_name: Joi.string().required().trim(),
        email: Joi.string().email().required().trim(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,32}$/).required().trim()
    });

    const {error, value} = Joi.validate(req.body, schema);

        if(error){
            switch(error.details[0].context.key){
                case 'email':
                    res.status(httpStatus.BAD_REQUEST).send({
                        error: 'You must provide a valid Email'
                    });
                    break;
                case 'first_name':
                    res.status(httpStatus.BAD_REQUEST).send({
                        error: 'You must provide a valid First Name'
                    });
                    break;
                case 'last_name':
                    res.status(httpStatus.BAD_REQUEST).send({
                        error: 'You must provide a valid Last Name'
                    });
                    break;
                case 'password': 
                    res.status(httpStatus.BAD_REQUEST).send({
                        error: `You must provide a Password that match the following rules:
                            <br>
                            1. It must contain ONLY lower case, upper case and numerics characters.
                            <br>
                            2. It must be between 6 and 32 characters in length
                        `
                    })
                    break;
                default:
                    res.status(httpStatus.BAD_REQUEST).send({
                        error: 'Invalid user information provided'
                    });
            }
        }else{
            next();
        }
}

module.exports = {ValidateUser};