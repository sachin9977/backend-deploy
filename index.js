const express = require("express");
const connection = require("./Config/db");
const { UserModel } = require("./Models/user.model");
const { Todo } = require("./Models/todo.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors")
const { authentication } = require("./Middlewares/authentication");
const app = express();

app.use(cors());

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  bcrypt.hash(password, 5, async function (err, hash) {
    if (err) {
      res.send("Something went wrong, plz try again later");
    }
    const user = new UserModel({
      email,
      password: hash,
    });
    try {
      await user.save();
      res.json({ msg: "Signup successfull" });
    } catch (err) {
      console.log(err);
      res.send("Something went wrong, plz try again");
    }
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    const hash = user.password;
    bcrypt.compare(password, hash, function (err, result) {
      if (err) {
        res.send("Something went wrong, plz try again later");
      }
      if (result) {
        const token = jwt.sign({ userId: user._id }, "secret");
        res.json({ message: "Login successfull", token });
      } else {
        res.send("Invalid credentials, plz signup if you haven't");
      }
    });
  } catch (e) {
    res.send("Email or Password Incorrect");
  }
});
// app.use(authentication())
app.post("/todos/create", authentication, async (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, "secret", async function (err, decoded) {
    if (err) {
      res.send("Please login");
    } else {
      const payload = req.body;
      console.log(payload);
      const new_todo = new Todo(payload);
      await new_todo.save();
      res.send("Added Successfully");
    }
  });
});
app.get("/todos", authentication, async (req, res) => {
  const data = await Todo.find({ userId: req.body.userId });

  res.send(data);
});

app.put("/todos/:id",authentication, async (req, res) => {
  
      const id = req.params.id;
      const payload = req.body.status;
      console.log("P AY L O A D ", payload);
      const find = await Todo.update({ id: id }, { $set: { status: payload } });
      res.send("Updated");
   
});
app.delete("todos/:id",authentication, async (req, res) => {
    console.log("===========")
      const payload = req.params.id;
      const del = await Todo.deleteOne({ id: +payload });
      res.send("Task Deleted");
    
});

app.listen(8080, async () => {
  try {
    await connection;
  } catch {
    console.log("F A I L E D");
  }
});
