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
  let afterSend = new Date();
  console.log(books);
  console.log('listBooks response time is ',afterSend-beforeSend,' ms');
  return books;
};

const insertBook = async (id, title, author) => {
  var book = { id: parseInt(id), title: title, author: author };
  let res = await axios.post(`${BASE_URL}/insert`,book);
  console.log(res.data)
  socket.emit('insert',book)
  console.log('insertBook response time is ',afterSend-beforeSend,' ms');
}

const getBook = async (id) => {
  const res = await axios.get(`${BASE_URL}/book/${id}`);
  const book = res.data;
  console.log(book);
  console.log('getBook response time is ',afterSend-beforeSend,' ms');
  return book;
};

const deleteBook = async (id) => {
  let res = await axios.delete(`${BASE_URL}/delete/${id}`);
  console.log(res.data)
  console.log('deleteBook response time is ',afterSend-beforeSend,' ms');

}

var processName = process.argv.shift();
var scriptName = process.argv.shift();
var command = process.argv.shift();

let beforeSend = new Date();

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