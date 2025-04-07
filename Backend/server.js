const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const brandRoutes = require('./router/BrandRoutes'); 
const productRoutes = require("./router/ProductRoutes");
const barcodeRoutes = require('./router/DigitalSign');
const qrRoutes = require("./router/ExtractData"); 

app.use(cors({
    origin: process.env.ORIGIN_URL,
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'], 
    credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false, 
    saveUninitialized: false,
    cookie: {
        secure: false, 
        maxAge: 1000 * 60 * 60 * 24, 
    }
}));

const url = process.env.SECRET_URL;

mongoose.connect(url);
const con = mongoose.connection;

con.on('open', () => {
    console.log('DB connected SUCCESSFULLY ...');
});


app.use('/brand', brandRoutes);
app.use("/product", productRoutes);
app.use('/ds', barcodeRoutes);
app.use("/qr", qrRoutes);

app.listen(4000, () => {
    console.log('Server running on port 4000');
});