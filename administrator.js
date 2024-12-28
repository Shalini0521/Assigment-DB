const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Azie:Azie1234@azie.33okh.mongodb.net/?retryWrites=true&w=majority&appName=Azie";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB and keep the connection open
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the app if MongoDB connection fails
  }
}

// Ensure the database connection is established before the server starts
connectToMongoDB();

exports.AddStudent = function (req, res) {
    const { username, Matrix, Program } = req.body;
  
    client.db("Assignment").collection("Student").find({
      "Matrix":{$eq:req.body.Matrix },
    
  }).toArray().then((result) =>{
    console.log(result)
  
    if(result.length>0) {
  
      res.status(400).send ("Student already exist")
  
    }
    else {
      client.db("Assignment").collection("Student").insertOne(
        {
          "username": username,
          "Matrix": Matrix,
          "Program": Program
        })
  
         res.send('Student added successfully')
       
     }
   } )  
  }

  exports.AddStaff = function (req, res) {
    const { Name, Staffid } = req.body;
  
    client.db("Assignment").collection("Staff").find({
      "Staffid":{$eq:req.body.Staffid },
    
  }).toArray().then((result) =>{
    console.log(result)
  
    if(result.length>0) {
  
      res.status(400).send ("Staff already exist")
  
    }
    else {
      client.db("Assignment").collection("Staff").insertOne(
        {
          "Name": Name,
          "Staffid": Staffid
        })
  
         res.send('Staff added successfully')
       
     }
   } )  
  }

  exports.AddProgram = function (req, res) {
    const { Name, Code } = req.body;
  
    client.db("Assignment").collection("Program").find({
      "Code":{$eq:req.body.Code },
    
  }).toArray().then((result) =>{
    console.log(result)
  
    if(result.length>0) {
  
      res.status(400).send ("Program already exist")
  
    }
    else {
      client.db("Assignment").collection("Program").insertOne(
        {
            "Name": Name,
            "Code": Code
        })
  
         res.send('Program added successfully')
       
     }
   } )  
  }

  exports.viewStudentList = function (req, res) {
    client.db("Assignment").collection("Student").find({
      "Matrix": { $eq: req.body.Matrix }
    }).toArray().then((result) => {
      if (result.length > 0) {
        res.status(200).json(result);
        res.status(400).send('View Successful')
      } else {
        res.send('No record')
      }
    })
  }
  