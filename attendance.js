const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.post('/attendance', async (req, res) => {
  const { matrix, date, subject, section } = req.body;
  try {
    attendanceModule.recordAttendance(matrix, date, subject, section);
    res.status(201).send("Attendance Submitted");
  } catch (error) {
    console.log(error);
    res.status(500).send(Error, { error });
  }
});

  async function recordAttendance(matrix, date, subject, section) {
    try {
      const database = client.db('BENR2423');
      const collection = database.collection('attendance');

      const user = {
        "matrix": matrix,
        "date": date,
        "subject": subject,
        "section": section,
      };

      await collection.insertOne(user);
      console.log("Attendance Submitted Successfully");
    }
    catch (error) {
      console.log("Attendance already exists")
    }
  }

app.listen(port, () => {
  console.log('Example app listening on port ${port}')
})