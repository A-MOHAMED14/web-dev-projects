import express from "express";
import bodyParser from "body-parser";
// import { dirname } from "path";
// import { fileURLToPath } from "url";

// const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 5000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", (req, res) => {
  console.log(req.body);
  const blogPostSubmission = {
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: req.body.eMail,
    authorBio: req.body.bio,
    blogTitle: req.body.pTitle,
    blogContent: req.body.pContent,
  };
  res.render("blog.ejs", { blogPost: blogPostSubmission });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
