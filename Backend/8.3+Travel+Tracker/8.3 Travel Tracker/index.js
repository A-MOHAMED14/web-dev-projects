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

async function checkVisistedCountries() {
  const response = await db.query("SELECT country_code FROM visited_countries");

  let countriesVisited = [];

  response.rows.forEach((country) => {
    countriesVisited.push(country.country_code);
  });

  return countriesVisited;
}

// GET home page
app.get("/", async (req, res) => {
  try {
    const countriesVisited = await checkVisistedCountries();

    res.render("index.ejs", {
      countries: countriesVisited,
      total: countriesVisited.length,
    });
  } catch (err) {
    console.error("Error:", err);
  }
});

// INSERT new country
app.post("/add", async (req, res) => {
  const newCountryVisited = req.body.country;
  try {
    const response = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [newCountryVisited.toLowerCase()]
    );

    const newCountryCode = response.rows[0].country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [newCountryCode]
      );
      res.redirect("/");
    } catch (err) {
      //country_code must be unique
      console.error("Error querying database:", err);
      const countriesVisited = await checkVisistedCountries();
      res.render("index.ejs", {
        countries: countriesVisited,
        total: countriesVisited.length,
        error: "Country has already been added, try again",
      });
    }
  } catch (err) {
    //country_name must exist in countries table
    console.error("Error querying database:", err);
    const countriesVisited = await checkVisistedCountries();
    res.render("index.ejs", {
      countries: countriesVisited,
      total: countriesVisited.length,
      error: "Country name does not exist, try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
