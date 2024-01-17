app.get('/viewreport', async (req, res) => { 
  try { 
    const db = client.db("BENR2423"); 
    const viewreport = await db.collection("user").findOne().toArray(); 
    console.log(viewreport); 
  } catch (error) { 
    res.send('Error viewing'); 
  } 
}); 
 
