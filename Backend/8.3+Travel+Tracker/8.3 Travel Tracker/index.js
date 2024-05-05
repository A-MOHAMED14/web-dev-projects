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

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const response = await db.query(
      "SELECT country_code FROM visited_countries"
    );

    let countriesVisited = [];

    response.rows.forEach((country) => {
      countriesVisited.push(country.country_code);
    });

    console.log(response.rows, "<--------");
    console.log(countriesVisited, "*******");

    res.render("index.ejs", {
      countries: countriesVisited,
      total: countriesVisited.length,
    });

    // db.end();
  } catch (err) {
    console.error("Error:", err);
  }
});

app.post("/add", async (req, res) => {
  // console.log(req.body, "<<<<<<<<");
  const newCountryVisited = req.body.country;

  const response = await db.query(
    "SELECT country_code FROM countries WHERE country_name = $1",
    [newCountryVisited]
  );
  // console.log(response.rows[0], "$$$$$$$$$$");

  const newCountryCode = response.rows[0].country_code;
  console.log(newCountryCode, "*********");

  await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [
    newCountryCode,
  ]);

  const result = await db.query("SELECT country_code FROM visited_countries");

  let countriesVisited = [];

  result.rows.forEach((country) => {
    countriesVisited.push(country.country_code);
  });

  res.render("index.ejs", {
    countries: countriesVisited,
    total: countriesVisited.length,
  });
  db.end();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
