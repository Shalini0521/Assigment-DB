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

exports.AddSubject = function (req, res) {
    const { Code, Name } = req.body;
  
    client.db("Assignment").collection("Subject").find({
      "Code":{$eq:req.body.Code },
    
  }).toArray().then((result) =>{
    console.log(result)
  
    if(result.length>0) {
  
      res.status(400).send ("Subject already exist")
  
    }
    else {
      client.db("Assignment").collection("Subject").insertOne(
        {
          "Code": req.body.Code,
          "Name": req.body.Name
        })
  
         res.send('Subject added successfully')
       
     }
   } )  
  }

  exports.AttendanceList = function (req, res) {
    client.db("Assignment").collection("Attendance").find({
      "Subject": { $eq: req.body.Subject }
    }).toArray().then((result) => {
      if (result.length > 0) {
        res.status(200).json(result);
        res.status(400).send('View Successful')
      } else {
        res.send('No record')
      }
    })
  }