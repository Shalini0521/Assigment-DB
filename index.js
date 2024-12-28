console.log("Hello, world!");const { request } = require("express");

const express = require('express')
const app = express()
const port = 3000;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const attendance = require ('./attendance.js')

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

//app.get('/attendance', (req, res) => {
// res.send(attendance)
//});

function verifyToken(req, res, next) {
  let header = req.headers.authorization;

  if (!header) {
    return res.status(401).send('Unauthorized request');
  }

  let tokens = header.split(' ')[1]; // Ensure correct space-based split

  try {
    // Log token for inspection
    console.log('Received token:', tokens);

    jwt.verify(tokens, 'very strong password', async (err, decoded) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).send('Invalid token');
      }

      console.log('Decoded token:', decoded);


      if (!decoded || !decoded.role) { // Check for missing properties
        return res.status(401).send('Invalid or incomplete token');
      }

      if (decoded.role !== 'lecturer' && decoded.role !== 'student' && decoded.role !== 'admin') {
        return res.status(401).send('Invalid role');
      }

      next();
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Internal server error');
  }
}


app.use(express.json())

//register
app.post('/register',(req,res)=> {
  const{username,password,role}=req.body;
  console.log(username,password);

  const hash = bcrypt.hashSync(password,10);

  client.db("BENR2423").collection("users").find({
    "username":{$eq:req.body.username }

  }).toArray().then((result) =>{
    console.log(result)

    if(result.length>0) {

      res.status(400).send ("Username already exists")
    }
    else {
      client.db("BENR2423").collection("users").insertOne({"username":req.body.username,"password":hash,"role":req.body.role});

      res.send("register successfully")
  }

} )
  
});

//login
app.post('/login', async (req, res) => {
  console.log('login', req.body);
  const { username, password } = req.body;

  console.log(username, password);

  const user = await client.db("BENR2423").collection("users").find({ "username": username }).toArray();
  console.log(user);

  if (user) {
    bcrypt.compare(password, user[0].password, (err, result) => {
      if (result) {

    
        const token = jwt.sign({

          user: user[0].username,
          role: user[0].role
        }, "very strong password", { expiresIn: "365d" });

        res.send(token)
      }
      else {
        res.send("wrong password")
      }

    })
  } else {

    res.send("user not found")

  }
});

//logout
app.post('/logout', (req, res) => {

  console.log('logout', req.body);

res.send("See You Next Time")

})

// start the server
app.listen(port, () => {
    console.log('Example app listening on port ${port}')
})