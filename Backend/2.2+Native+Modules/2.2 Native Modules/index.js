const fs = require("fs"); // native node module

// console.log(fs);

fs.writeFile("message2.txt", "Hello from the world of NodeJS!", (err) => {
  if (err) {
    console.error("Error writing to file:", err);
  } else {
    console.log("File written successfully");
  }
});

fs.readFile("./message.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
  } else {
    console.log("File content:", data);
  }
});
