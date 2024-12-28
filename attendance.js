const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const attendance = require ('./attendance.js')

// Add this middleware to parse JSON in the request body
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


app.post('/attendance', async (req, res) => {
  const { matrix, date, subject, code, section } = req.body;

  client.db("BENR2423").collection("attendance").find({
    "matrix":{$eq:req.body.matrix },
  
}).toArray().then((result) =>{
  console.log(result)

  if(result.length>0) {

    res.status(400).send ("Matrix already exists")

  }
  else {
    client.db("BENR2423").collection("attendance").insertOne(
      {
           "matrix": req.body.matrix,
        "date": req.body.date,
        "subject": req.body.subject,
        "code": req.body.code,
        "section": req.body.section

      })

       res.send('Attendance Submit successfully')
     
   }
 } )  
   
});


function StudentToken(req,res,next) {
  let header = req.headers.authorization;

  if(!header) {
    return res.status(401).send('Unauthorized request');
  }

  let tokens = header.split('')[1];//Ensure correct space-based split

  try{
    //log token for inspection
    console.log('Received token:',tokens);

    jwt.verify(tokens, 'very strong password', async(err,decoded) => {
      if(err){
        console.error('Error verifying token:',err);
        return res.status(401).send('invalid token');
      }

      console.log('Decoded token:',decoded);

      if(!decoded||!decoded.role){//check for missing properties
       return res.status(401).send('invalid or incomplete token');
      }

      if (decoded.role!=='student'){
        return res.status(401).send('invalid role');
      }

      next();
    })
  }catch(error){
    console.error('Unexpected error:',error);
    res.status(500).send('Internal server error');
  }
  }


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
