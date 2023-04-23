const express = require('express');
const { registerUser, getAllUsers, login, getFriends, addFriend, removeFriend, getFriendRequests } = require('./user');
const cors = require('cors');
const { getMessage, sendMessage } = require('./message');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
  const { username, name } = req.body
  let { password } = req.body
  password = jwt.sign(password, JWT_SECRET);
  const user = await registerUser(username, name, password);
  if (!user) {
    return res.status(500).send({ error: 'User already exists' });
  }
  return res.json(user);
});

app.post('/login', async (req, res) => {
  const { username } = req.body
  let { password } = req.body
  password = jwt.sign(password, JWT_SECRET);
  const user = await login(username, password);
  return res.json(user);
});

app.get('/users', async (req, res) => {
  const users = await getAllUsers();
  return res.json(users);
});

app.get('/messages', async (req, res) => {
  const messages = await getMessage();
  return res.json(messages);
});

app.post('/sendMessage', async (req, res) => {
  const { authorId, message } = req.body;
  const response = await sendMessage(authorId, message);
  return res.json(response);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

app.get('/friends/:id', async (req, res) => {
  const { id } = req.params;
  const friends = await getFriends(id);
  return res.json(friends);
});

app.post('/addFriend/:id/:friendId', async (req, res) => {
  const { id, friendId } = req.params;
  const friends = await addFriend(id, friendId);
  return res.json(friends);
});

app.delete('/removeFriend/:id/:friendId', async (req, res) => {
  const { id, friendId } = req.params;
  const friends = await removeFriend(id, friendId);
  return res.json(friends);
});

app.get('/friendRequests/:id', async (req, res) => {
  const { id } = req.params;
  const friendRequests = await getFriendRequests(id);
  return res.json(friendRequests);
});
