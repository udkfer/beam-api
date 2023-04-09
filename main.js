const express = require('express');
const { registerUser, getAllUsers } = require('./user');

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

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
