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

const flowerSchema = new mongoose.Schema({
    name: String,
    photo: String,
    instructions:String
  });

  const ownerSchema = new mongoose.Schema({
    userEmail: String,
    flowers:[flowerSchema]
  });

  const ownerModel = mongoose.model('flower', ownerSchema);


const PORT= process.env.PORT || 3001;


// http:localhost:3001/
server.get('/',getHomeHandler);
// http:localhost:3001/getData
server.get('/getData',getDataHandler);
// http:localhost:3001/getFavData
server.get('/getFavData',getFavDataHandler);
// http:localhost:3001/addData
server.post('/addData',addDataHandler);
// http:localhost:3001/deleteData
server.delete('/deleteData/:idx',deleteDataHandler);
// http:localhost:3001/deleteData
server.put('/updateData/:idx',updateDataHandler);



function seedingData(){
    const rahaf = new ownerModel({
        email:'rahafjazz@gmail.com',
        favflower:{
            'nameflower':'Rose',
            'instructions':'Beautiful large royal purple flowers adorn attractive satiny green leaves that turn orange\/red in cold weather. Grows to up to 18 feet, or prune annually to shorten.',
            'photo':'test'
        }
    })
    const roaa = new ownerModel({
        email:'roaa.abualeeqa@gmail.com',
        favflower:{
            'nameflower':'Rose',
            'instructions':'Beautiful large royal purple flowers adorn attractive satiny green leaves that turn orange\/red in cold weather. Grows to up to 18 feet, or prune annually to shorten.',
            'photo':'test'
        }
    })
}

//seedingData()

function getDataHandler(req,res){
    const url='https://flowers-api-13.herokuapp.com/getFlowers';
    axios.get(url).then(result=>{
        // console.log(result.data.flowerslist);
        res.send(result.data.flowerslist);
    })
}

function getFavDataHandler(req,res){
    const {userEmail}=req.query;
    ownerModel.findOne({userEmail:userEmail},(error,data)=>{
        if (error) console.log('from get Fav',error);
        else{
            res.send(data.flowers);
        }
    })

}


function addDataHandler(req,res){
    const {userEmail,flowersObj}=req.body;
    ownerModel.findOne({userEmail:userEmail},(error,data)=>{
        if(error) console.log(error);
        else if (!data){
            const newOwner= ownerModel({
                userEmail:userEmail,
                flowers:[flowersObj],
            })
            newOwner.save()
        }
        else{
            data.flowers.unshift(flowersObj);
            data.save();
        }
    })
}


function deleteDataHandler(req,res){
    const {idx}=req.params;
    const {userEmail}=req.query;
    ownerModel.findOne({userEmail:userEmail},(err,result)=>{
        if (err) console.log(err);
        else{
           result.flowers.splice(idx,1);
               result.save().then(()=>{
                   ownerModel.findOne({userEmail:userEmail},(err,result)=>{
                       res.send(result.flowers);
                   })
               })
           
        }
    })
}

function updateDataHandler(req,res){
    const {idx}=req.params;
    const {userEmail,flowersObj}=req.body;
    ownerModel.findOne({userEmail:userEmail},(err,result)=>{
        if (err)console.log(err);
        else{
            result.flowers[idx]=flowersObj;
            result.save().then(()=>{
                ownerModel.findOne({userEmail:userEmail},(err,result)=>{
                    res.send(result.flowers);
                })
            })
        }
    })
}

function getHomeHandler(req,res){
    res.send('From the root route')
}


server.listen(PORT,()=>{
    console.log(`I'm Listening to port ${PORT}`);
})