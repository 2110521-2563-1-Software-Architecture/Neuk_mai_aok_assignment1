# HW1_Software_Arch (REST Api with Swagger)
## Things to be delivered:
## 1. Screenshots of Swagger for your APIs in 2. 
![swagger_code](https://github.com/2110521-2563-1-Software-Architecture/Neuk_mai_aok_assignment1/blob/master/photo/q1/swagger_code.png =250x250)
![all](https://github.com/2110521-2563-1-Software-Architecture/Neuk_mai_aok_assignment1/blob/master/photo/q1/all.png =250x250)
## 2. Source codes of 2 and 3.

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
## 3. Compare how to call the methods based on gRPC and REST API side-by-side, e.g. in a Table format as shown below.

| Function     | gRPC         | REST API   |
| ---          |     ---      |     ---    |
| List book    |  `client.list({}, function(error, books) {printResponse(error, books);});`                     | await axios.get(`${BASE_URL}/books`);   |
| Get book    |  `client.get({id: parseInt(id)}, function(error, books) {printResponse(error, book);});`        | await axios.get(`${BASE_URL}/book/{id}`);   |
| Insert book  | `client.insert(book, function(error, empty) {printResponse(error, empty);});`                  | await axios.post(`${BASE_URL}/insert`,book);   |
| Delete book  | `client.delete({id: parseInt(id)}, function(error, empty) {printResponse(error, empty);});`    | await axios.delete(`${BASE_URL}/delete/${id}`);|
| Watch book   | `call.on('data', function(book) {console.log(book);});`       | `socket.on('notify',(book) => {console.log(book)})`   |

## 4. What are the main differences between REST API and gRPC?

  ในส่วนของ REST จะใช้ JSON,XML แต่ใน gRPC จะใช้ Protobuf ซึ่งเก็บข้อมูลในแบบ binary ทำให้ส่งข้อมูลกันได้อย่างรวดเร็ว แต่มีข้อเสียตรงนี้มนุษย์อย่างเราจะอ่านไม่ออก อีกประเด็นหนึ่งที่แตกต่างคือ REST ใช้ HTTP/1.1 แต่ gRPC ใช้ HTTP/2 ซึ่ง HTTP/2 มี Performance ที่ดีกว่ามาก โดยรวมแล้ว gRPC มี Performance ที่ดีกว่า REST 
  
## 5. What is the benefits of introduce interface in front of the gRPC and REST API of the book services.
  ลด coupling ระหว่าง class ทำให้ระบบง่ายต่อการพัฒนามากขึ้น, client จะไม่เห็น code ข้างในทำให้ tranparency
## 6. Based on the introduced interface, compare how to call the methods based on gRPC and REST API side-by-side, e.g. in a
Table format as shown below. 

| Function     | gRPC         | REST API   |
| ---          |     ---      |     ---    |
| List book    | node interface.js grpc list   | node interface.js rest list |
| Get book    | node interface.js grpc get {id}    | node interface.js rest get {id} |
| Insert book  | node interface.js grpc insert {id} {title} {author}     | node interface.js rest insert {id} {title} {author}  |
| Delete book  | node interface.js grpc delete {id}     | node interface.js rest delete {id}   |
| Watch book   | node interface.js grpc watch     |  -  |

## 7. Draw a component diagram representing the book services with and without interfaces. 
without interface
![non_interface](https://github.com/2110521-2563-1-Software-Architecture/Neuk_mai_aok_assignment1/blob/master/photo/q1/non_interface.png =250x250)

with interface
![interface](https://github.com/2110521-2563-1-Software-Architecture/Neuk_mai_aok_assignment1/blob/master/photo/q1/interface.png =250x250)
