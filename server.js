const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'incident_management',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    return;
  }
  console.log('Connected to MySQL database');
});

// User login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  
  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).send("Server error");

    if (result.length === 0) return res.status(401).send("Invalid credentials");

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ id: user.id }, "secretkey", { expiresIn: "1h" });

    res.json({ token });
  });
});

// Protected route (Example)
app.get("/api/incidents", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).send("Unauthorized");

  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err) return res.status(401).send("Invalid token");

    db.query("SELECT * FROM incidents", (err, result) => {
      if (err) return res.status(500).send("Database error");
      res.json(result);
    });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
