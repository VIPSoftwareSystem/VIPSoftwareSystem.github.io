const express = require("express");
const app = express();
const port = 3000;

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "127.0.0.1:3306",
  user: "glasgowAdmin",
  password: "7&6H^OrifDxa6xlr",
  database: "glasgow",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }
  console.log("Connected to the database!");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/saveData", (req, res) => {
  const { LicensePlate, Passengers, Grade, plateType, notes } = req.body;

  const recordedDate = new Date().toISOString();

  const sql = `INSERT INTO plates (LicensePlate, Passengers, Grade, plateType, notes, RecordedDate)
                VALUES ('${LicensePlate}', '${Passengers}', '${Grade}', '${plateType}', '${notes}', '${recordedDate}')`;

  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing SQL query: ", err);
      res.status(500).json({ error: "Failed to save data" });
      return;
    }
    console.log("Data saved successfully!");
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});