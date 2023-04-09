const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function registerUser(username, name, password) {
    const user = await prisma.user.create({
        data: {
            username,
            name,
            password,
        },
    });
    return user;
}

async function getAllUsers() {
    const users = await prisma.user.findMany();
    return users;
}

module.exports = {
    registerUser,
    getAllUsers,
};