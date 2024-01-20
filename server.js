const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvents = require("./logEvents");
const EventEmitter = require("events");
class Emitter extends EventEmitter {}

// Initialize object
const myEmitter = new Emitter();

const PORT = process.env.PORT || 3500;

const serveFile = async (filepath, contentType, response) => {
  try {
    const data = await fsPromises.readFile(filepath, "utf8");
    response.writeHead(200, { "Content-Type": contentType });
    response.end(data);
  } catch (error) {
    console.log(error);
    response.statusCode = 500;
    response.end();
  }
};

/* const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  let filepath;

  if (req.url === "/" || req.url === "index.html") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    filepath = path.join(__dirname, "views", "index.html");
    fs.readFile(filepath, "utf8", (err, data) => {
      res.end(data);
    });
  }
}); */

/* const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  let filepath;

  switch (req.url) {
    case "/":
      res.statusCode = 200;
      filepath = path.join(__dirname, "views", "index.html");
      fs.readFile(filepath, "utf8", (err, data) => {
        res.end(data);
      });
      break;
  }
}); */

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  const extension = path.extname(req.url);

  let contentType;

  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;

    case ".js":
      contentType = "text/javascript";
      break;

    case ".json":
      contentType = "application/json";
      break;

    case ".jpg/jpeg":
      contentType = "image/jpeg";
      break;

    case ".png":
      contentType = "image/png";
      break;

    case ".txt":
      contentType = "text/plain";
      break;

    default:
      contentType = "text/html";
  }

  // Chain ternary statement

  let filepath;
  contentType =
    "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "views", req.url, "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);

  // Makes .html extension not required in the browser

  if (!extension && req.url.slice(-1) !== "/") {
    filepath += ".html";
  }

  const fileExists = fs.existsSync(filepath);

  if (fileExists) {
    // File exists serve the file

    serveFile(filepath, contentType, res);
  } else {
    // 404 or 301-redirect
    switch (path.parse(filepath).base) {
      case "old-page.html":
        res.writeHead(301, { " Location": "/new-page.html" });
        res.end();
        break;

      case "www-page.html":
        res.writeHead(301, { " Location": "/" });
        res.end();
        break;

      default:
        // Serve 404

        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }
  }
});

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
