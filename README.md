# HW1_Software_Arch (REST Api with Swagger)
## Things to be delivered:
1. Screenshots of Swagger for your APIs in 2. 
![all](https://github.com/2110521-2563-1-Software-Architecture/Neuk_mai_aok_assignment1/blob/master/photo/all.png)
![get](https://github.com/2110521-2563-1-Software-Architecture/Neuk_mai_aok_assignment1/blob/master/photo/get.png)
![post](https://github.com/2110521-2563-1-Software-Architecture/Neuk_mai_aok_assignment1/blob/master/photo/post.png)
2. Source codes of 2 and 3.
Server
```
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./openAPI');

var books = [
  { id: 123, title: "A Tale of Two Cities", author: "Charles Dickens" },
];

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World, from express");
});

app.post("/insert", (req, res) => {
  const book = req.body;
  console.log(book);
  books.push(book);
  res.send("Book is added to the database");
});

app.get("/books", (req, res) => {
  res.json(books);
});


app.get("/book/:id", (req, res) => {
  let target;
  const id = parseInt(req.params.id);
  for (var i = 0; i < books.length; i++) {
    if (books[i].id == id) {
      target = books[i];
    }
  }
  res.json(target);
});

app.delete("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);

  for (var i = 0; i < books.length; i++) {
    if (books[i].id == id) {
      books.splice(i, 1);
      // return true;
    }
  }
  res.send("Book is deleted");
});


server = app.listen(port, () => {
  console.log(`Hello world app listening on port ${port}!`);

});

var io = require("socket.io")(server);

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on('insert',(book) => {
        io.sockets.emit('notify',book)
    })
  });
  
```
Client 
```
const axios = require('axios');
const io = require("socket.io-client");
const BASE_URL = 'http://localhost:3000';

let socket = io.connect(BASE_URL);

const watchBooks = async() => {
  socket.on('notify',(book) => {console.log(book)})
}

const listBooks = async () => {
  const res = await axios.get(`${BASE_URL}/books`);
  const books = res.data;
  console.log(books);
  return books;
};

const insertBook = async (id, title, author) => {
  var book = { id: parseInt(id), title: title, author: author };
  let res = await axios.post(`${BASE_URL}/insert`,book);
  console.log(res.data)
  socket.emit('insert',book)
}

const getBook = async (id) => {
  const res = await axios.get(`${BASE_URL}/book/${id}`);
  const book = res.data;
  console.log(book);
  return book;
};

const deleteBook = async (id) => {
  let res = await axios.delete(`${BASE_URL}/delete/${id}`);
  console.log(res.data)
}

var processName = process.argv.shift();
var scriptName = process.argv.shift();
var command = process.argv.shift();

if (command == 'list')
  listBooks();
else if (command == 'insert')
  insertBook(process.argv[0], process.argv[1], process.argv[2]);
else if (command == 'get')
  getBook(process.argv[0]);
else if (command == 'delete')
  deleteBook(process.argv[0]);
else if (command == 'watch')
  watchBooks();
  
```
3. Compare how to call the methods based on gRPC and REST API side-by-side, e.g. in a Table format as shown below.

| Function     | gRPC         | REST API   |
| ---          |     ---      |     ---    |
| List book    | xxx   | xxx |
| Insert book  | xxx     | xxx   |
| Delete book  | xxx     | xxx   |
| Watch book   | xxx     | xxx   |

4. What are the main differences between REST API and gRPC?
5. What is the benefits of introduceinterface in front of the gRPC and REST API of the book services.
6. Based on the introduced interface, compare how to call the methods based on gRPC and REST API side-by-side, e.g. in a
Table format as shown below. 

| Function     | gRPC         | REST API   |
| ---          |     ---      |     ---    |
| List book    | xxx   | xxx |
| Insert book  | xxx     | xxx   |
| Delete book  | xxx     | xxx   |
| Watch book   | xxx     | xxx   |

7. Draw a component diagram representing the book services with and without interfaces. 
