import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import volleyball from 'volleyball';
import mongoose from 'mongoose';
import {ErrorHandler, NotFoundError} from './src/middleware/errors.middleware';
import {UserRouter} from './src/routes/user.route';

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.Promise = global.Promise;


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(volleyball);
app.use(cors());


import './src/passport/index';

app.use('/users', UserRouter);

app.use(NotFoundError);
app.use(ErrorHandler);

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useCreateIndex: true}).then(()=>{
    console.log('Database connected successtully...');
    app.listen(PORT, ()=>{
        console.log(`Application listening on http://localhost:${PORT}`);
    })

}).catch(err =>{
    console.log(err.message);
})