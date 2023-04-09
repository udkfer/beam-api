const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const port = 3000;

app.use(express.json());

app.post('/register', async (req, res) => {
  const { username, name, password } = req.body
  const user = await prisma.user.create({
    data: {
      username,
      name,
      password,
    },
  });
  res.json(user);
});

app.get('/users', async (req, res) => {
        const users = await prisma.user.findMany();
        res.json(users);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
