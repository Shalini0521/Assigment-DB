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

 /**login admin function*/
async function login(reqUsername, reqPassword) {
  return adminCollection.findOne({ username: reqUsername, password: reqPassword })
    .then(matchUsers => {
      if (!matchUsers) {
        return {
          success: false,
          message: "Admin not found!"
        };
      } else {
        return {
          success: true,
          users: matchUsers
        };
      }
    })
    .catch(error => {
        console.error('Error in login:', error);
        return {
          success: false,
          message: "An error occurred during login."
        };
      });
}

/**create admin function */
async function register(reqUsername, reqPassword) {
  return adminCollection.insertOne({
    username: reqUsername,
    password: reqPassword,
    
  })
    .then(() => {
      return "Registration successful!";
    })
    .catch(error => {
      console.error('Registration failed:', error);
      return "Error encountered!";
    });
}

function generateToken(userData) {
  const token = jwt.sign(userData, 'inipassword');
  return token

}

function verifyToken(req, res, next) {
  let header = req.headers.authorization;
  console.log(header);

  let token = header.split(' ')[1];

  jwt.verify(token, 'inipassword', function (err, decoded) {
    if (err) {
      res.send('Invalid Token');
    }

    req.user = decoded;
    next();
  });
}



// Login Admin
app.post('/login', (req, res) => {
  console.log(req.body);

  let result = login(req.body.username, req.body.password);
  result.then(response => {
    console.log(response); // Log the response received

    if (response.success) {
      let token = generateToken(response.users);
      res.send(token);
    } else {
      res.status(401).send(response.message);
    }
  }).catch(error => {
    console.error('Error in login route:', error);
    res.status(500).send("An error occurred during login.");
  });
});


// Register Admin
app.post('/register', (req, res) => {
  console.log(req.body);

  let result = register(req.body.username, req.body.password, req.body.name, req.body.email);
  result.then(response => {
    res.send(response);
  }).catch(error => {
    console.error('Error in register route:', error);
    res.status(500).send("An error occurred during registration.");
  });
});

// Create a student
document = document.getElementById("form1").addEventListener("submit", submitFun1);

var studentDataArr =JSON.parse(localStorage.getItem("studentData"))|| [];
function submitFun1(e) {
    document.querySelector("#tbody").innerHTML = "";
    e.preventDefault();
    var name = document.querySelector("#name").value;
    var program = document.querySelector("#program").value;
    var section = document.querySelector("#section").value;
    var matrixno = document.querySelector("#matrixno").value;

    var studentObj = {
        name: name,
        program: program,
        section: section,
        matrixno: matrixno
    }

    studentDataArr.push(studentObj);
    localStorage.setItem("studentData", JSON.stringify(studentDataArr));
    document.querySelector("#form1").reset();
    alert("Student Added Successfully");

    displayFun(studentDataArr)
}

function displayFun(studentDataArr) {

    var count = 1;
    studentDataArr.map(function (item) {
    
        var tr = document.createElement("tr");

        var td1 = document.createElement("td");
        td1.innerHTML = count++
        var td2 = document.createElement("td");
        td2.innerHTML = item.name;
        var td3 = document.createElement("td");
        td3.innerHTML = item.number;
        var td4 = document.createElement("td");
        td4.innerHTML = item.city;
        var td5 = document.createElement("td");
        td5.innerHTML = item.rollNo;
        var td6 = document.createElement("td");
        var btn1 = document.createElement("button");
        btn1.innerHTML = "P";
        btn1.addEventListener("click", function () {
            td6.innerHTML = "<button >Present</button>";
        });
        var btn2 = document.createElement("button");
        btn2.innerHTML = "A";
        btn2.addEventListener("click", function () {
            td6.innerHTML = "<button id='absent'>Absent</button>";
        
        });
        td6.classList.add("td6");
        td6.append(btn1, btn2);

        tr.append(td1, td2, td3, td4, td5, td6);

        document.querySelector("#tbody").append(tr);

    });


}
displayFun(studentDataArr);

app.post('/createstudentData', verifyToken, (req, res) => {
  const {
    name,
    city,
    relationship,
    visitorId
  } = req.body;

  const visitorData = {
    name,
    program,
    section,
    matrixno
  };

  studentCollection
    .insertOne(studentData)
    .then(() => {
      res.send(studentData);
    })
    .catch((error) => {
      console.error('Error creating student:', error);
      res.status(500).send('An error occurred while creating the student');
    });
});

//update student
app.patch('/updatestudent/:id', verifyToken, async (req, res) => {
  try {
    const objectId = new ObjectId(req.params.id);
    const {matrixno} = req.body;

    const updateResult = await db.collection('STUDENT').updateOne(
      { _id: objectId }, 
      { $set: {matrixno }),

    if (updateResult.modifiedCount === 1) {
      res.send('Student data successfully updated!');
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error updating student data:', error);
    res.status(500).send('Error updating student data');
  }
});



//Delete a student
app.delete('/deletestudent/:id', verifyToken, async (req, res) => {
  const objectId = new ObjectId(req.params);
  

  try {
    const deleteResult = await db.collection('STUDENT').deleteOne({ _id:objectId });

    if (deleteResult.deletedCount === 1) {
      res.send('Student deleted successfully');
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).send('Error deleting student');
  }
});



// start the server
app.listen(port,()=>{
    console.log('Example app listening on port ${port}')
})