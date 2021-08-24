'use strict';


const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const server = express();
server.use(cors());
server.use(express.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/flower', {useNewUrlParser: true, useUnifiedTopology: true});

const PORT= process.env.PORT || 3001;

// http:localhost:3001/
server.get('/',getHomeHandler);
// http:localhost:3001/getData
server.get('/getData',getDataHandler);
// http:localhost:3001/addData
server.post('/addData',addDataHandler);

function getDataHandler(req,res){
    const url='https://flowers-api-13.herokuapp.com/getFlowers';
    axios.get(url).then(result=>{
        console.log(result.data.flowerslist);
        res.send(result.data.flowerslist);
    })
}

function addDataHandler(req,res){
    const {userEmail}=req.query;
}



function getHomeHandler(req,res){
    res.send('From the root route')
}


server.listen(PORT,()=>{
    console.log(`I'm Listening to port ${PORT}`);
})