const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const corsOptions = {
  origin: "*",
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

///////////////
//////DB///////
/////////

const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgres://default:b9cCFfsNR0Xa@ep-bold-dream-a2o9m2z7.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require",
});
pool.connect((err, client, done) => {
  if (err) {
    console.error("Error connecting to DB:", err);
    return;
  }
  console.log("Connected to DB!");

  // const createUserTableQuery = `
  //   CREATE TABLE IF NOT EXISTS users (
  //     id SERIAL PRIMARY KEY,
  //     name VARCHAR(255) NOT NULL,
  //     email VARCHAR(255) UNIQUE NOT NULL,
  //     password VARCHAR(255) NOT NULL
  //   );
  // `;

  // client.query(createUserTableQuery, (error, result) => {
  //   done(); // Release the client back to the pool
  //   if (error) {
  //     console.error("Error creating users table:", error);
  //   } else {
  //     console.log("Users table created successfully!");
  //   }
  // });
});

//////////
/////////TOKEN//////
/////////////////

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "net ninja secret", {
    expiresIn: maxAge,
  });
};

/////////////////////
//////////ROUTES///////
/////////////////////

app.get("/", (req, res) => {
  res.json("data");
});
app.get("/signup", (req, res) => {
  res.json("SIGNUP");
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const emailCheckSql = "SELECT COUNT(*) as count FROM users WHERE email = ?";
    const emailCheckValues = [email];

    pool.query(
      emailCheckSql,
      emailCheckValues,
      async (emailCheckErr, emailCheckResult) => {
        if (emailCheckErr) {
          console.error("Error checking existing email:", emailCheckErr);
          return res.status(500).json("Internal Server Error");
        }

        const emailCount = emailCheckResult[0].count;

        if (emailCount > 0) {
          return res
            .status(400)
            .json({ field: "email", message: "Email is already registered" });
        }

        // Generate a salt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash the password with the generated salt
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertUserSql =
          "INSERT INTO users(`name`, `email`, `password`) VALUES (?, ?, ?)";
        const insertUserValues = [name, email, hashedPassword];

        pool.query(insertUserSql, insertUserValues, (insertErr, insertData) => {
          if (insertErr) {
            console.error("Error inserting new user:", insertErr);
            return res.status(500).json("Internal Server Error");
          }

          console.log("Data successfully inserted:", insertData);
          const token = createToken(insertData.insertId);

          res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

          return res.json({ status: "Success", token: token });
        });
      }
    );
  } catch (error) {
    console.error("Error handling signup request:", error);
    res.status(500).json("Internal Server Error");
  }
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE `email` = ?";
  const values = [req.body.email];

  pool.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.json("User is not register");
    }

    if (data.length > 0) {
      const user = data[0];

      // Compare the provided password with the stored hashed password
      bcrypt.compare(req.body.password, user.password, (compareErr, result) => {
        if (compareErr) {
          console.error("Error comparing passwords:", compareErr);
          return res.json("Fail");
        }

        if (result) {
          const token = createToken(user.id);

          res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

          console.log("Login successful");
          return res.json({ status: "Success", data: user, token: token });
        } else {
          console.log("Incorrect password");
          return res
            .status(400)
            .json({ field: "password", message: "Invalid password" });
        }
      });
    } else {
      console.log("User is not register");
      return res
        .status(400)
        .json({ field: "email", message: "Email is not registered" });
    }
  });
});

app.post("/create", async (req, res) => {
  const { title, description, ingredients, photo_url, userID } = req.body;

  try {
    const sql =
      "INSERT INTO recipes(`title`, `description`, `ingredients`, `photo_url`, `userID`) VALUES (?, ?, ?, ?, ?)";
    const values = [title, description, ingredients, photo_url, userID];

    pool.query(sql, values, (err, data) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.json(err);
      }

      console.log("Recipe successfully inserted:", data);

      return res.json({ status: "Success" });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json("Internal Server Error");
  }
});
// ////////////////////////

app.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logout successful" });
});

app.get("/users", (req, res) => {
  const q = "SELECT * FROM users";
  pool.query(q, (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

app.get("/recipe", (req, res) => {
  const q = "SELECT * FROM recipes";
  pool.query(q, (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

app.post("/delete", (req, res) => {
  const { id } = req.body;
  console.log(id);
  const q = "DELETE FROM recipes WHERE id = ?";

  pool.query(q, [id], (err, results) => {
    if (err) {
      console.error("Error deleting recipe:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.affectedRows > 0) {
      return res.status(200).json({ message: "Recipe deleted successfully" });
    } else {
      return res.status(404).json({ error: "Recipe not found" });
    }
  });
});

app.get("/auth", (req, res) => {
  const q = "SELECT * FROM users WHERE `id` = ?";
  const values = [req.query.id];

  pool.query(q, values, (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

app.listen(8800, () => {
  console.log("Listen on port 8800!");
});

// const db = mysql.createConnection({
//   host: process.env.HOST,
//   user: "root",
//   password: process.env.PASSWORD_DB,
//   database: "recipe",
// });
// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err);
//     return;
//   }
//   console.log("Connected to MySQL!");
// });
