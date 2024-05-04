import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "code4funloop4ever!",
  port: 5432,
});

db.connect;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const response = await db.query(
      "SELECT country_code FROM visited_countries"
    );

    let countriedVisited = [];

    response.rows.forEach((country) => {
      countriedVisited.push(country.country_code);
    });

    console.log(response.rows, "<--------");
    console.log(countriedVisited, "*******");

    res.render("index.ejs", {
      countries: countriedVisited,
      total: countriedVisited.length,
    });

    db.end();
  } catch (err) {
    console.error("Error:", err);
    // res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
