import {Router} from 'express';
import {Register, Login} from '../controllers/user/user.controller';
import {ValidateUser} from '../middleware/user.middleware';

const UserRouter = Router();

UserRouter.route('/register').post(ValidateUser, Register);
UserRouter.route('/login').post(Login);

module.exports = {UserRouter};