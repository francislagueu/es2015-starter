import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
//import jwt from 'jsonwebtoken';

const {Schema} = mongoose;

const UserSchema = new Schema({
    first_name: {
        type: String,
        trim: true,
        required: 'Please Provide a first name'
    },
    last_name: {
        type: String,
        trim: true,
        required: 'Please Provide a last name'
    },
    email: {
        type: String,
        trim: true,
        required: 'Please Provide an email ',
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: 'Please Provide a password'
    }

}, {timestamps: true});

UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.validatePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}
 
UserSchema.methods.responseObject = function(/*flag = true*/){
    const {_id, first_name, last_name, email, createdAt, updatedAt} = this;
    const response = {_id, first_name, last_name, email, createdAt, updatedAt};
    // if(flag){
    //     response.token = token;
    // }
    return response;
}

//  get token(){
//     const {_id, first_name,last_name, email} = this;
//     return jwt.sign({_id, first_name,last_name, email},
//         process.env.SECRET, {expiresIn: '1d'});
// }

const User = mongoose.model('User', UserSchema);
module.exports = User;
