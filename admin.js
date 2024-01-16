const { request } = require("express");

const express = require('express')
const app = express()
const port = process.env.PORT ||3001;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json())

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
app.post('/student',(req,res)=> {
  const{name,matrixNo}=req.body;
  console.log(name,matrixNo);

  const hash = bcrypt.hashSync(matrixNo,15);

  client.db("BENR2423").collection("student").insertOne({"name":name,"matrixNo":hash});
  console.log(hash);

  res.send("student added")
});

app.get('/student', async (req, res) => {
  try {
    const students = await students.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// start the server
app.listen(port, () => {
    console.log('Example app listening on port ${port}')
})