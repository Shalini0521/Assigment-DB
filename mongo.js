const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const staff = require("./staff.js");
const student = require("./student.js");
const administrator = require("./administrator.js");
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

      if (decoded.role !== 'staff' && decoded.role !== 'student' && decoded.role !== 'admin') {
        return res.status(401).send('Invalid role');
      }

      next();
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Internal server error');
  }
}

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hash = bcrypt.hashSync(password, 10);

    const db = client.db("Assignment");
    const usersCollection = db.collection("Users");

    // Check if username already exists
    const existingUser = await usersCollection.findOne({ username: req.body.username });

    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    // Insert the new user
    await usersCollection.insertOne({
      username: req.body.username,
      password: hash,
      role: req.body.role,
    });

    res.send("Register successfully");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("An error occurred during registration");
  }
});

//login
app.post('/login', async (req, res) => {
  console.log('login', req.body);
  const { username, password } = req.body;

  console.log(username, password);

  const user = await client.db("Assignment").collection("Users").find({ "username": username }).toArray();
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

//Staff Add Subject
app.post('/AddSubject', async (req, res) => {
    console.log(req.body);
    staff.AddSubject(req, res);
  })

//Staff View Attendance List
app.post('/AttendanceList', async (req, res) => {
    console.log(req.body);
    staff.AttendanceList(req, res);
})

//Student Record Attendance
app.post('/RecordAttendance', async (req, res) => {
    console.log(req.body);
    student.RecordAttendance(req, res);
})

//Student View Attendance
app.post('/viewAttendance', async (req, res) => {
    console.log(req.body);
    student.viewAttendance(req, res);
})

//Administrator Add Student
app.post('/AddStudent', async (req, res) => {
    console.log(req.body);
    administrator.AddStudent(req, res);
})

//Administrator Add Staff
app.post('/AddStaff', async (req, res) => {
    console.log(req.body);
    administrator.AddStaff(req, res);
})

//Administrator Add Program
app.post('/AddProgram', async (req, res) => {
    console.log(req.body);
    administrator.AddProgram(req, res);
})

//Administrator View Student List
app.post('/viewStudentList', async (req, res) => {
    console.log(req.body);
    administrator.viewStudentList(req, res);
})

//logout
app.post('/logout', (req, res) => {

  console.log('logout', req.body);

res.send("See You Next Time")

})

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Closing MongoDB connection...");
  await client.close();
  process.exit(0);
});
