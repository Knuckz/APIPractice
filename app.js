const express = require('express');                     //require express so that we don't have to do a lot of parse work ourself
const bodyParser = require('body-parser');              //So that we can parse requests.

const feedRoutes = require('./routes/feed');            //We are requiring the routes from feed so that we can use them below. this lets me seperate 
                                                        //all of the routes that could ave a feed route into a seperate file.
const app = express();                                  //This creates the express app

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json using the json body parser to parse json data as opposed to url data like above

//Middleware that sets headers onto a response that lets the client know it is okay to use
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);   //The feed route

app.listen(8080);               //starts the express app, and listens from incoming requests