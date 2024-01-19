app.post("/view-student-list, second, async (req.res) => {
  try {
    const list = await viewStudentList();
    console.log(list);
    return res.status(201).send("View successfully completed");

  }
  catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }

