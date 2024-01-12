const { request } = require("express");

const express = require('express')
const app = express()
const port = process.env.PORT ||3000;

app.use(express.json())

//MongoDB collection URL
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://b022210058:Shalini@00@cluster0.vf1sfvl.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// connect to MongoDB
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

//define collection name
const db = client.db('STUDENT_AMS');
const studentCollection = db.collection ('STUDENT');
const academicadminCollection = db.collection ('ACADEMICADMIN');
const facultyCollection = db.collection ('FACULTY');
<<<<<<< HEAD
<<<<<<< HEAD
const cellCollection = db.collection ('CELL');

=======
<<<<<<< HEAD

const administrator = db.collection ('admin');
 
=======
const facultyCollection = db.collection ('FACULTY');
>>>>>>> 62069f1c5b5402a90f892a570d0140e12f46f9ae
=======
const administrator = db.collection ('admin');
>>>>>>> c2f7e1a29908bb852acdbc1417bd40894198b950


// start the server
app.listen(port,()=>{
    console.log('Example app listening on port ${port}')
})