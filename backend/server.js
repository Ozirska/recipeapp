const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Sunrise11_",
  database: "recipe",
});
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL!");
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
  const q = "SELECT * FROM users";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Generate a salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql =
      "INSERT INTO users(`name`, `email`, `password`) VALUES (?, ?, ?)";
    const values = [name, email, hashedPassword];

    db.query(sql, values, (err, data) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.json(err);
      }

      console.log("Data successfully inserted:", data);
      const token = createToken(data.insertId);
      console.log("DATAID", data.insertId);

      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

      return res.json({ status: "Success", token: token });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json("Internal Server Error");
  }
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE `email` = ?";
  const values = [req.body.email];

  db.query(sql, values, (err, data) => {
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
          return res.status(400).json({field:"password", message: "Invalid password"});
        }
      });
    } else {
      console.log("User is not register");
      return res.status(400).json({field:"email", message: "Email is not registered"});
    }
  });
});

app.post("/create", async (req, res) => {
  const { title, description, ingredients, photo_url, userID } = req.body;

  try {
    const sql =
      "INSERT INTO recipes(`title`, `description`, `ingredients`, `photo_url`, `userID`) VALUES (?, ?, ?, ?, ?)";
    const values = [title, description, ingredients, photo_url, userID];

    db.query(sql, values, (err, data) => {
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
////////////////////////

app.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logout successful" });
});

app.get("/users", (req, res) => {
  const q = "SELECT * FROM users";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

app.get("/recipe", (req, res) => {
  const q = "SELECT * FROM recipes";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

app.get("/auth", (req, res) => {
  const q = "SELECT * FROM users WHERE `id` = ?";
  const values = [req.query.id];

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

app.listen(8800, () => {
  console.log("Listen on port 8800!");
});
