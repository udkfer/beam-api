const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getMessage(authorId) {
  const message = await prisma.message.findMany({
    where: {
      authorId,
    },
  });
  return message;
}

async function sendMessage(authorId, message) {
  const messages = await prisma.message.create({
    data: {
      message,
      authorId,
    },
  });
  return messages;
}

module.exports = {
    getMessage,
    sendMessage,
};