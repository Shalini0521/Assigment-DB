const { request } = require("express");

const express = require('express')
const app = express()
const port = process.env.PORT ||3000;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
app.use(express.json());

//MongoDB collection URL

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://b022210058:tAGrofj9DyRYHqeo@cluster0.95rvnk9.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

//add student
app.post('/student', async (req, res) => {
  const { matrix, name, year,semester, program, section } = req.body;

  client.db("BENR2423").collection("student").find({
    "matrix":{$eq:req.body.matrix },
  
}).toArray().then((result) =>{
  console.log(result)

  if(result.length>0) {

    res.status(400).send ("Student already exist")

  }
  else {
    client.db("BENR2423").collection("student").insertOne(
      {
        "matrix": req.body.matrix,
        "name": req.body.name,
        "year": req.body.year,
        "semester": req.body.semester,
        "program": req.body.program,
        "section": req.body.section

      })

       res.send('Student added successfully')
     
   }
 } )  
   
});

//find and view one student
app.post('/findstudent', async (req, res) => {
  const { matrix} = req.body;

  client.db("BENR2423").collection("student").find({
    "matrix":{$eq:req.body.matrix },
  
}).toArray().then((result) =>{
  console.log(result)

  if(result.length>0) {

    console.log('Found student:', result);
    res.json({ success: true, student: result });

  }
  else {
    console.log('Student not found');
    res.status(404).json({ success: false, message: 'Student not found' });
     
   }
 } )  
   
});


//view all students list
app.get('/viewAllStudents', async (req, res) => {
  try {
    const allStudents = await client.db("BENR2423").collection("student").find().toArray();

    if (allStudents.length > 0) {
      console.log('Found all students:', allStudents);
      res.json({ success: true, students: allStudents });
    } else {
      console.log('No students found');
      res.status(404).json({ success: false, message: 'No students found' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});






// start the server
app.listen(port, () => {
    console.log('Example app listening on port ${port}')
})