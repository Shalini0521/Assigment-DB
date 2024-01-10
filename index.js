const { request } = require("express");

const express = require('express')
const app = express()
const port = process.env.PORT ||3000;

app.use(express.json())

app.get('/',(req,res)=>{       //req=request //res=respond
    res.send('Helo World!')
})

app.post('/login', (req,res)=> {
    console.log(req,body,username != 'shalini') 
    return res.status(400).send('Invalid user')



    //TODO: check if password is correct
    if(req,body,password !='Shalini@00'){
        return res.status(400).send('Invalid user')
    }
    
});
//res.send('login successfully')

//app.post('/api/echo',(req,res)=>{})




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

//22/11/23
app.post('/register' , (req, res) => {

  client.db("maybank2u").collection("user".find({
    "username": {$eq: req.body.username }
  }).toArray().then((result)=> {
    if (result.length > 0) {
      res.status(400).send('username already exists')
    
    } else {
      client.db("maybank2u".collection("users").insertone({
          "username": req.body.username,
          "password": req.body.password
      }))

      res.send('REGISTER SUCCESSFULLY')
    }
  }))
})

app.listen(port,()=>{
    console.log('Example app listening on port ${port}')
})