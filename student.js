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

exports.RecordAttendance = function (req, res) {
    const { username, Matrix, Subject, Program, Date, Time } = req.body;
    client.db("Assignment").collection("Attendance").insertOne(
        {
            "username": username,
            "Matrix": Matrix,
            "Subject": Subject,
            "Program": Program,
            "Date": Date,
            "Time": Time,
            "Status": 'Present'
        }).then((result) => {
        console.log(req.body);
        res.send('Attendance recorded successfully');
        })
        .catch((err) => {
        console.error(err);
        res.status(500).send('Error recording attendance');
    })
}

exports.viewAttendance = function (req, res) {
    const {matrix} = req.body;
  
    client.db("Assignment").collection("Attendance").find({
      "Matrix":{$eq:req.body.Matrix },
    
  }).toArray().then((result) =>{
    console.log(result)
  
    if(result.length>0) {
  
      console.log('Found Attendance:', result);
      res.json({ success: true, student: result });
  
    }
    else {
      console.log('Attendance not found');
      res.status(404).json({ success: false, message: 'Student not found' });
       
     }
   } )  
     
  }
  