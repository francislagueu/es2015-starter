import express from 'express';
import cors from 'cors';
import volleyball from 'volleyball';
import mongoose from 'mongoose';
import {ErrorHandler, NotFoundError} from './src/middleware/errors.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
const MONGO_URL = 'mongodb://localhost:27017/boiler';

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(volleyball);
app.use(cors());

app.use(NotFoundError);
app.use(ErrorHandler);

mongoose.connect(MONGO_URL, {useNewUrlParser: true}).then(()=>{
    console.log('Database connected successtully...');
    app.listen(PORT, ()=>{
        console.log(`Application listening on http://localhost:${PORT}`);
    })

}).catch(err =>{
    console.log(err.message);
})