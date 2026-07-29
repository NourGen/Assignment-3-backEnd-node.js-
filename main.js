const express = require("express");
const cors = require("cors");
const { resolve } = require("node:path");
const userSource = resolve("./users.json");
const fs = require("node:fs");
const app = express();
const port = 3000;
app.use(cors(), express.json());

let auth = true;
let isAdmin = false;

function checkAuth(req, res, next) {
  if (auth) {
    next();
  } else {
    next(new Error("Messing credentials"));
    // return res.status(401).json({ message: "Messing credentials" });
  }
}

function authorization(req, res, next) {
  if (isAdmin) {
    next();
  } else {
    next(new Error("NOT ALLOWED"));
    // return res.status(403).json({ message: "NOT ALLOWED" });
  }
}

app.use(["/signup", "/login"], checkAuth);

app.post("/signup", (req, res, next) => {
  const body = req.body;
  if (Object.keys(body).length > 3) {
    return res
      .status(400)
      .json({ messageError: "Enter just the username & email & password" });
  }
  const { username, email, password } = body;
  if (!username || !email || !password) {
    return res.status(400).json({ messageError: "Missing required fields" });
  } else if (!email.includes("@")) {
    return res.status(400).json({ messageError: "Invalid email format" });
  } else if (typeof password !== "string") {
    return res.status(400).json({ messageError: "Password MUST be string" });
  } else if (password.length < 4) {
    return res.status(400).json({ messageError: "Password is too short" });
  } else {
    fs.readFile(userSource, "utf-8", (error, data) => {
      if (error) {
        res.status(500).json({ messageError: "Internal Server Error" });
        return;
      } else {
        try {
          data = JSON.parse(data);
        } catch (error) {
          res.status(500).json({ messageError: error.message });
          return;
        }

        const match = data.find((ele) => {
          return ele.email === email;
        });
        if (match) {
          res
            .status(409)
            .json({ messageError: `The email : ${email} already exists` });
        } else {
          const newId =
            data.length > 0 ? Math.max(...data.map((ele) => ele.id)) + 1 : 1; //ternary operator the only operator that has three operands (1:condition)?(2:if true):(3:if false)
          data.push({ username, email, password, id: newId });
          fs.writeFile(userSource, JSON.stringify(data), (error) => {
            if (error) {
              res.status(500).json({ messageError: "Failed to save user" });
            } else {
              res.status(201).json({ message: "Signup successful" });
            }
          });
        }
      }
    });
  }
}); //DONE👴 //Q.1

app.post("/login", (req, res, next) => {
  body = req.body;
  if (Object.keys(body).length > 2) {
    return res
      .status(400)
      .json({ messageError: "Enter just the email & password" });
  } else {
    const { email, password } = body;
    if (!email || !password) {
      return res.status(400).json({ messageError: "Missing required fields" });
    } else if (!email.includes("@")) {
      return res.status(400).json({ messageError: "Invalid email format" });
    } else {
      fs.readFile(userSource, "utf-8", (error, data) => {
        if (error) {
          return res
            .status(500)
            .json({ messageError: "Internal Server Error" });
          return;
        } else {
          data = JSON.parse(data);
          const match = data.find((ele) => {
            return ele.email === email;
          });
          if (!match) {
            return res.status(409).json({
              messageError: `The email : ${email} doesn't exist sign up first`,
            });
          } else if (!(match.password === password)) {
            return res.status(409).json({
              messageError: `Wrong Password`,
            });
          } else {
            return res.status(200).json({
              messageError: `Login successful`,
            });
          }
        }
      });
    }
  }
}); //DONE👴

app.get("/users", (req, res, next) => {
  fs.readFile(userSource, "utf-8", (error, data) => {
    if (error) {
      return res.status(500).json({ messageError: "Internal Server Error" });
    } else {
      try {
        data = JSON.parse(data);
      } catch (error) {
        return res.status(500).json({ messageError: "Internal Server Error" });
      }
      const safeUsers = data.map(
        ({ password, ...restOfTheElement }) => restOfTheElement,
      ); //return a new array without the passwords for the security🕵️‍♂️
      return res.status(200).json(safeUsers);
    }
  });
}); //DONE👴 //Q.5

app.get("/users/filter", (req, res, next) => {
  fs.readFile(userSource, "utf-8", (error, data) => {
    if (error) {
      return res.status(500).json({ messageError: "Internal Server Error" });
    } else {
      try {
        data = JSON.parse(data);
      } catch (error) {
        return res.status(500).json({ messageError: "Internal Server Error" });
      }
      const safeUsers = data
        .map(({ password, ...restOfTheElement }) => restOfTheElement)
        .sort((a, b) => a.age - b.age); //(+) sort b before a [b,a] //(-) sort a before b [a,b] //(0) keep the original order
      return res.status(200).json(safeUsers);
    }
  });
}); //DONE👴 //Q.6

app.get("/user/name/:username", (req, res, next) => {
  const { username } = req.params;
  fs.readFile(userSource, (error, data) => {
    if (error) {
      res.status(500).json({ messageError: error.message });
    } else {
      try {
        data = JSON.parse(data);
      } catch (error) {
        res.status(500).json({ messageError: error.message });
      }
      const matchID = data.find((ele) => {
        return ele.username == username;
      });
      if (!matchID) {
        res.status(404).json({ messageError: "Page not found" });
      } else {
        const { password, ...restOfTheUserData } = matchID;
        res.status(200).json(restOfTheUserData);
      }
    }
  });
}); //DONE👴 //Q.4

app.get("/user/id/:id", (req, res, next) => {
  const { id, username } = req.params;
  fs.readFile(userSource, (error, data) => {
    if (error) {
      res.status(500).json({ messageError: error.message });
    } else {
      try {
        data = JSON.parse(data);
      } catch (error) {
        res.status(500).json({ messageError: error.message });
      }
      const matchID = data.find((ele) => {
        return ele.id == id;
      });
      if (!matchID) {
        res.status(404).json({ messageError: "Page not found" });
      } else {
        const { password, ...restOfTheUserData } = matchID;
        res.status(200).json(restOfTheUserData);
      }
    }
  });
}); //DONE👴 //Q.7

app.delete("/user{/:id}", (req, res, next) => {
  const { id } = req.params;
  fs.readFile(userSource, (error, data) => {
    if (error) {
      res.status(500).json({ messageError: error.message });
    } else {
      try {
        data = JSON.parse(data);
      } catch (error) {
        res.status(500).json({ messageError: error.message });
      }
      const matchID = data.find((ele) => {
        return ele.id == id || ele.id == req.body.id;
      });
      if (!matchID) {
        res.status(404).json({ messageError: "Page not found" });
      } else {
        data.splice(data.indexOf(matchID), 1);
        fs.writeFile(userSource, JSON.stringify(data), (error) => {
          if (error) {
            res.status(500).json({ messageError: error.message });
          } else {
            res
              .status(200)
              .json({ message: "The user has been deleted successfully" });
          }
        });
      }
    }
  });
}); //DONE👴 //Q.3

app.patch("/user/:id", (req, res, next) => {
  const { id } = req.params;
  body = req.body;
  if (Object.keys(body) == 0) {
    return res.status(200).json({ messageError: "There is nothing to updata" });
  }
  fs.readFile(userSource, (error, data) => {
    if (error) {
      res.status(500).json({ messageError: error.message });
    } else {
      try {
        data = JSON.parse(data);
      } catch (error) {
        res.status(500).json({ messageError: error.message });
      }
      const matchID = data.find((ele) => {
        return ele.id == id;
      });
      if (!matchID) {
        res.status(404).json({ messageError: "Page not found" });
      } else {
        Object.assign(matchID, body);
        fs.writeFile(userSource, JSON.stringify(data), (error) => {
          if (error) {
            res.status(500).json({ messageError: error.message });
          } else {
            const { password, ...userWithOutPassword } = matchID;
            res.status(200).json({
              message: "The user has been Updated successfully",
              userData: userWithOutPassword,
            });
          }
        });
      }
    }
  });
}); //DONE👴 //Q.2

app.all("{/*dummy}", (req, res, next) => {
  return res.status(404).json({ message: "Page not found" });
});

app.use((error, req, res, next) => {
  return res.json({ errorMessage: error.message });
});

app.listen(port, () => {
  console.log(`Server is running on port:::${port} ...༼ つ ◕_◕ ༽つ`);
});
