import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
//import jwt from 'jsonwebtoken';

const {Schema} = mongoose;

const UserSchema = new Schema({
    first_name: {
        type: String,
        required: 'Please Provide a first name'
    },
    last_name: {
        type: String,
        required: 'Please Provide a last name'
    },
    email: {
        type: String,
        required: 'Please Provide an email ',
        unique: true
    },
    password: {
        type: String,
        required: 'Please Provide a password'
    }

}, {timestamps: true});

UserSchema.pre('save', async (next)=>{
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.validatePassword = async (password)=>{
    return await bcrypt.compare(password, this.password);
}
 
UserSchema.methods.responseObject = (/*flag = true*/)=>{
    const {_id, first_name, last_name, email, created_at, updated_at} = this;
    const response = {_id, first_name, last_name, email, created_at, updated_at};
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

module.exports = mongoose.model('User', UserSchema);
