const express = require('express');
const { registerUser, getAllUsers } = require('./user');
const { getMessage, sendMessage } = require('./message');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/register', async (req, res) => {
  const { username, name, password } = req.body
  const user = await registerUser(username, name, password);
  res.json(user);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await login(username, password);
  res.json(user);
});

app.get('/users', async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
});

app.get('/messages', async (req, res) => {
  const messages = await getMessage();
  res.json(messages);
});

app.post('/sendMessage', async (req, res) => {
  const { authorId, message } = req.body;
  const response = await sendMessage(authorId, message);
  res.json(response);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
