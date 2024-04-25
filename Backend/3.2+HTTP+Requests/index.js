import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Homepage</h1>");
});

app.get("/contact", (req, res) => {
  res.send("<h1>Contact Me</h1><p>Email: myemail123@gmail.com</p>");
});

app.get("/about", (req, res) => {
  res.send(
    "<h1>About Me</h1><p>Hi there, my name is Mohamed.</p>"
  );
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
