import mongoose from 'mongoose';
//import configObjet from './config/config.js';

//const {MONGO_URL} = configObjet;
mongoose
    .connect(
        "mongodb+srv://francososa:estoesboca12@cluster0.5txnf.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => console.log("Connected to DB"))
    .catch(() => console.log("Error connecting to DB"));
