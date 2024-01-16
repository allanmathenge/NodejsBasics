const fs = require("fs");
const path = require("path");

fs.readFile(
  path.join(__dirname, "files", "starter.txt"),
  "utf8",
  (err, data) => {
    if (err) throw err;
    console.log(data);
  }
);

console.log("Hello...");

fs.writeFile(
  path.join(__dirname, "files", "reply.txt"),
  "This is something you must understand",
  (err) => {
    if (err) throw err;
    console.log("write complete!");
  }
);

fs.appendFile(
  path.join(__dirname, "files", "test.txt"),
  "Append file creates and writes files at the same time.",
  (err) => {
    if (err) throw err;
    console.log("Append complete!");
  }
);

// exit on uncaught exception

process.on("uncaughtException", (err) => {
  console.error(`There was an uncaught error: ${err}`);
  process.exit(1);
});
