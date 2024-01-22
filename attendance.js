const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const attendance = require ('./attendance.js')

// Add this middleware to parse JSON in the request body
app.use(express.json());

app.post('/attendance', async (req, res) => {
  const { matrix, date, subject, section } = req.body;

  client.db("BENR2423").collection("attendance").find({"matrix":{$eq:req.body.matrix },
  
}).toArray().then((result) =>{
  console.log(result)

  if(result.length>0) {

    res.status(400).send ("Matrix already exists")

  }
  else {
    client.db("BENR2423").collection("attendance").insertone(
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
   
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
