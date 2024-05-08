import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "code4funloop4ever!",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

async function checkToDoList() {
  const response = await db.query("SELECT * FROM items");
  items = response.rows;
  return items;
}

app.get("/", async (req, res) => {
  const updatedList = await checkToDoList();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: updatedList,
  });
});

app.post("/add", async (req, res) => {
  console.log(req.body, "<-----");
  const item = req.body.newItem;
  try {
    const response = await db.query(
      "INSERT INTO items (title) VALUES ($1) RETURNING *",
      [item]
    );
    console.log(response.rows[0], "********");
    items.push(response.rows[0]);

    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

app.post("/edit", async (req, res) => {
  console.log(req.body, "<<<<<<<<<<");
  try {
    const response = await db.query(
      "UPDATE items SET title = $1 WHERE id = $2",
      [req.body.updatedItemTitle, req.body.updatedItemId]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

app.post("/delete", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
