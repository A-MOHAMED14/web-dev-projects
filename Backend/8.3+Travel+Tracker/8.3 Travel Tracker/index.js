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

app.post("/add", async (req, res) => {
  try {
    const newCountryVisited = req.body.country;

    const response = await db.query(
      "SELECT country_code FROM countries WHERE country_name = $1",
      [newCountryVisited]
    );

    if (response.rows.length > 0) {
      const newCountryCode = response.rows[0].country_code;

      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [newCountryCode]
      );
      res.redirect("/");
    } else {
      console.log("Invalid country name ❌");
      // res.redirect("/"); 
    }
  } catch (err) {
    console.error("Error querying database:", err);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
