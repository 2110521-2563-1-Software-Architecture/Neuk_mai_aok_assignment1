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
  let res = await axios.post(`${BASE_URL}/book`,book);
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
  let res = await axios.delete(`${BASE_URL}/book/${id}`);
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