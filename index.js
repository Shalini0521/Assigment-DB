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

/*app.post('/register', async (req, res) => {
  try {
    const { username, password, role, Staffid } = req.body;

    // Validate input
    if (!username || !password || !role) {
      return res.status(400).send('All fields are required.');
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
    }

    // Check if the user already exists
    const existingUser = await client.db("Assignment").collection("User").findOne({ username });
    if (existingUser) {
      console.log("Username already exists.");
      return res.status(409).send('Username already exists.');
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Create the user object
    const userObject = {
      username,
      password: hash,
      role,
      Staffid
    };

    // Insert the new user into the database
    await client.db("Assignment").collection("User").insertOne(userObject);

    // Optionally verify authorization header (if applicable)
    const authHeader = req.headers.authorization;
    let token;
    if (authHeader) {
      token = authHeader.split(' ')[1]; // Assuming "Bearer <token>" format
      console.log("Authorization token:", token);
    }

    console.log("User registered successfully:", username);
    res.status(201).send("Register Success!");

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).send("Internal Server Error");
  }
});*/

app.post('/register', async (req, res) => {
  try {
    const { username, password, role, Staffid, adminCode } = req.body;

    // Validate input
    if (!username || !password || !role) {
      return res.status(400).send('All fields are required.');
    }

    // Check if attempting to register as admin
    if (role === 'Admin') {
      const predefinedAdminCode = 'y24y'; // Replace with your actual secret code
      if (adminCode !== predefinedAdminCode) {
        return res.status(403).send('Forbidden: Invalid admin code.');
      }
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      );
    }

    // Check if the user already exists
    const existingUser = await client.db("Assignment").collection("User").findOne({ username });
    if (existingUser) {
      console.log("Username already exists.");
      return res.status(409).send('Username already exists.');
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Create the user object
    const userObject = {
      username,
      password: hash,
      role,
      Staffid
    };

    // Insert the new user into the database
    await client.db("Assignment").collection("User").insertOne(userObject);

    console.log("User registered successfully:", username);
    res.status(201).send("Register Success!");
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

const rateLimitMap = new Map(); // To track login attempts

app.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).send('Username and password are required.');
    }

    const maxAttempts = 5; // Maximum allowed attempts
    const lockoutTime = 15 * 60 * 1000; // Lockout period in milliseconds (15 minutes)

    // Check login attempts
    const attempts = rateLimitMap.get(username) || { count: 0, lockUntil: 0 };
    const currentTime = Date.now();

    if (attempts.lockUntil > currentTime) {
      return res.status(429).send('Account locked. Try again later.');clear

    }

    // Find user in the database
    const user = await client.db("Assignment").collection("User").findOne({ username });

    if (!user) {
      // Increment login attempts for invalid usernames
      updateLoginAttempts(username, attempts, maxAttempts, lockoutTime, currentTime);
      return res.status(401).send('Invalid username or password.');
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // Increment login attempts for incorrect passwords
      updateLoginAttempts(username, attempts, maxAttempts, lockoutTime, currentTime);
      return res.status(401).send('Invalid username or password.');
    }

    // Reset login attempts on successful login
    rateLimitMap.delete(username);

    // Generate JWT
    const token = jwt.sign(
      { user: user.username, role: user.role, Staffid : user.Staffid, Studentid : user.Studentid},
      process.env.JWT_SECRET || 'Assignment', // Use environment variable for secret
      { expiresIn: '1h' }
    );

    console.log('Login Successful');
    res.status(200).send({ token });

  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Helper function to update login attempts
function updateLoginAttempts(username, attempts, maxAttempts, lockoutTime, currentTime) {
  attempts.count += 1;

  if (attempts.count >= maxAttempts) {
    attempts.lockUntil = currentTime + lockoutTime;
    attempts.count = 0; // Reset count after locking
    console.log(`Account locked for username: ${username}`);
  }

  rateLimitMap.set(username, attempts);
}

//Staff Add Subject
/*app.post('/AddSubject/:id', StaffToken, async (req, res) => {
  try {
      if (req.user.role !== 'Staff') {
        return res.status(403).send('Forbidden: Only staff can add subjects');
      }
      if (req.user.Staffid !== req) {
        return res.status(403).send('Forbidden: You can only add subjects for yourself');
      }

      console.log(req.body);
      staff.AddSubject(req, res);
  }
  catch (error) {
      console.error('Internal Server Error:', error);
      res.status(500).send('Internal Server Error');
  }
});*/

app.post('/AddSubject/:id', StaffToken, async (req, res) => {
  try {
      console.log(req.user);
      if (req.user.role !== 'Staff') {
        return res.status(403).send('Forbidden: Only staff can add subjects');
      }
      if (req.user.Staffid !== req.params.id) {
        return res.status(403).send('Forbidden: You can only add subjects for yourself');
      }

      console.log(req.body);
      staff.AddSubject(req, res);
  }
  catch (error) {
      console.error('Internal Server Error:', error);
      res.status(500).send('Internal Server Error');
  }
});

//Staff View Attendance List
app.post('/AttendanceList', StaffToken, async (req, res) => {
    /*if (req.user.role !== 'Staff') {
        return res.status(403).send('Forbidden: Only staff can view attendance list');
    }*/
    console.log(req.body);
    staff.AttendanceList(req, res);
})

//Student Record Attendance
app.post('/RecordAttendance', StudentToken, async (req, res) => {
    /*if (req.user.role !== 'Student') {
        return res.status(403).send('Forbidden: Only student can record attendance');
    }*/
    console.log(req.body);
    student.RecordAttendance(req, res);
})

//Student View Attendance
app.post('/viewAttendance', StudentToken, async (req, res) => {
    /*if (req.user.role !== 'Student') {
        return res.status(403).send('Forbidden: Only student can view attendance');
    }*/
    console.log(req.body);
    student.viewAttendance(req, res);
})

//Administrator Add Student
app.post('/AddStudent', AdminToken, async (req, res) => {
    /*if (req.user.role !== 'Admin') {
        return res.status(403).send('Forbidden: Only admin can add student');
    }*/
    console.log(req.body);
    administrator.AddStudent(req, res);
})

//Administrator Add Staff
app.post('/AddStaff', AdminToken, async (req, res) => {
    /*if (req.user.role !== 'Admin') {
        return res.status(403).send('Forbidden: Only admin can add staff');
    }*/
    console.log(req.body);
    administrator.AddStaff(req, res);
})

//Administrator Add Program
app.post('/AddProgram', AdminToken, async (req, res) => {
    /*if (req.user.role !== 'Admin') {
        return res.status(403).send('Forbidden: Only admin can add program');
    }*/
    console.log(req.body);
    administrator.AddProgram(req, res);
})

//Administrator View Student List
app.post('/viewStudentList', AdminToken, async (req, res) => {
    /*if (req.user.role !== 'Admin') {
        return res.status(403).send('Forbidden: Only admin can view student list');
    }*/
    console.log(req.body);
    administrator.viewStudentList(req, res);
})

//logout
app.post('/logout', (req, res) => {

  console.log('logout', req.body);

res.send("See You Next Time")

})

// Middleware to validate token
app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token && invalidatedTokens.has(token)) {
    return res.status(401).json({ message: "Token is invalid. Please log in again." });
  }
  next();
});


// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Closing MongoDB connection...");
  await client.close();
  process.exit(0);
});

function generateAccessToken(payload) {
  return jwt.sign(payload, "Assignment", { expiresIn: '1h' });
}

function StudentToken(req, res, next) {
  let header = req.headers.authorization;

  if (!header) {
    return res.sendStatus(401).send('PUnauthorized');
  }
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, "Assignment", function (err, decoded) {
    console.log(err)
    if (err) {
      res.send("Invalid Token");
      return res.sendStatus(401).send('MUnauthorized');
    }
    else {
      console.log(decoded);
      if (decoded.role != 'Student') {
        return res.status(401).send('NUnauthorized');
      }
    }
    next();
  });
}

function StaffToken(req, res, next) {
  let header = req.headers.authorization;

  if (!header) {
    return res.sendStatus(401).send('Unauthorized');
  }
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, "Assignment", function (err, decoded) {
    console.log(err)
    if (err) {
      return res.sendStatus(401).send('Unauthorized');
    }
    else {
      console.log(decoded);
      if (decoded.role != 'Staff') {
        return res.status(401).send('Again Unauthorized');
      }
    }
    req.user = decoded;
    next();
  });
}

function StaffAdminToken(req, res, next) {
  let header = req.headers.authorization;

  if (!header) {
    return res.sendStatus(401).send('Unauthorized');
  }
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, "Assignment", function (err, decoded) {
    console.log(err)
    if (err) {
      return res.sendStatus(401).send('Unauthorized');
    }
    else {
      console.log(decoded);
      if ( (decoded.role != 'Staff') || (decoded.role!='Admin') ) {
        return res.status(401).send('Again Unauthorized');
      }
    }
    req.user = decoded;
    next();
  });
}

function AdminToken(req, res, next) {
  let header = req.headers.authorization;

  if (!header) {
    return res.sendStatus(401).send('Unauthorized');
  }
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, "Assignment", function (err, decoded) {
    console.log(err)
    if (err) {
      return res.sendStatus(401).send('Unauthorized');
    }
    else {
      console.log(decoded);
      if (decoded.role != 'Admin') {
        return res.status(401).send('Again Unauthorized');
      }
    }
    next();
  });
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
