const express = require("express");
// const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(cors());
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

const getClient = async () => {
  try {
    const client = await pool.connect();
    console.info("Connected to PostgreSQL");

    return client;
  } catch (err) {
    console.error("Fialed to connect: " + err.message);
    throw err;
  }
};

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
  const client = await getClient();
  const { name, email, password } = req.body;

  try {
    const emailCheckSql =
      "SELECT COUNT(*) as count FROM users WHERE email = $1::text";
    const emailCheckValues = [email];
    const emailCheckRes = await client.query(emailCheckSql, emailCheckValues);
    const emailsCount = emailCheckRes.rows.count;

    if (emailsCount > 0) {
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
      "INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING *";
    const insertUserValues = [name, email, hashedPassword];

    try {
      const insertRes = await client.query(insertUserSql, insertUserValues);
      const data = insertRes.rows[0];

      // console.log("Data successfully inserted:", data);
      const token = createToken(data.id);

      return res.status(200).json({
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
        },
        token: token,
      });
    } catch (err) {
      console.error("Error inserting new user:", err);
      return res.status(400).json({ message: "Internal server error" });
    } finally {
      client.end();
    }
  } catch (error) {
    console.error("Error handling signup request:", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const client = await getClient();

  const sql = "SELECT * FROM users WHERE email = $1::text";
  const values = [req.body.email];

  try {
    const selectRes = await client.query(sql, values);
    if (selectRes.rows.length > 0) {
      const user = selectRes.rows[0];

      // Compare the provided password with the stored hashed password
      bcrypt.compare(req.body.password, user.password, (compareErr, result) => {
        if (compareErr) {
          console.error("Error comparing passwords:", compareErr);
          return res.json("Fail");
        }

        if (result) {
          const token = createToken(user.id);

          console.log("Login successful");
          return res.status(200).json({ user: user, token: token });
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
  } catch (err) {
    console.log("Login error");
    res.status(400).json({ message: err });
  } finally {
    client.end();
  }
});

app.post("/create", async (req, res) => {
  const client = await getClient();

  const { title, description, ingredients, photo_url, userID } = req.body;

  try {
    const sql = `INSERT INTO recipes(title, description, ingredients, photo_url, "userID") VALUES ($1::text, $2::text, $3::text, $4::text, $5::int)`;
    const values = [title, description, ingredients, photo_url, userID];

    const insertRes = await client.query(sql, values);

    // console.log("Recipe successfully inserted:", insertRes.rows[0]);

    return res.status(204).json();
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json("Internal Server Error");
  } finally {
    client.end();
  }
});
// ////////////////////////

app.get("/users", (req, res) => {
  const q = "SELECT * FROM users";
  pool.query(q, (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

app.get("/recipe", async (req, res) => {
  const client = await getClient();

  const q = "SELECT * FROM recipes";
  try {
    const recipes = await client.query(q);

    res.status(200).json(recipes.rows);
  } catch (err) {
    console.log("not created");
    res.status(400).json({ message: err });
  }
});

app.post("/delete", async (req, res) => {
  const client = await getClient();
  // console.log("USERDATAID", req.body.id);

  const q = "DELETE FROM recipes WHERE id = $1::int";
  const values = [req.body.id];

  try {
    const deleteRecipe = await client.query(q, values);
    return res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.log("can't get recipe");

    return res.status(404).json({ error: "Recipe not found" });
  }
});

app.get("/auth", async (req, res) => {
  const client = await getClient();
  const q = "SELECT * FROM users WHERE id = $1::int";
  const values = [req.query.id];

  try {
    const selectQuery = await client.query(q, values);
    const data = selectQuery.rows[0];
    res.json({ id: data.id, name: data.name, email: data.email });
  } catch (err) {
    console.error(err);
    return res.status(400).json(err);
  } finally {
    client.end();
  }
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
