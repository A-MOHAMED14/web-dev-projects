import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "code4funloop4ever!",
  port: 5432,
});

const app = express();
const port = 3000;

db.connect;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let countriesVisited;
let totalCountries;

db.query("SELECT country_code FROM visited_countries", (err, res) => {
  if (err) {
    console.error("Error querying database:", err);
  } else {
    countriesVisited = res.rows;
    console.log(countriesVisited, "<-------");
    totalCountries = countriesVisited.length;
    console.log(totalCountries, "*********");
  }
  db.end();
});

app.get("/", async (req, res) => {
  res.render("index.ejs", { countries: countriesVisited, total: totalCountries });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
