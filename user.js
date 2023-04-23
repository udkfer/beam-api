const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function registerUser(username, name, password) {
    const userExists = await prisma.user.findUnique({
        where: {
            username,
        },
    });
    if (userExists) {
        return null;
    }
    const user = await prisma.user.create({
        data: {
            username,
            name,
            password,
        },
    });
    return user;
}

async function login(username, password) {
    const user = await prisma.user.findUnique({
        where: {
            username,
        },
    });
    if (!user) {
        return { error: 'User not found' };
    }
    if (user.password !== password) {
        return { error: 'Incorrect password' };
    }
    return user;
}

async function getAllUsers() {
    const users = await prisma.user.findMany();
    return users;
}

async function getFriends(id) {
    id = parseInt(id);
    const friends = await prisma.friend.findMany({
        where: {
            userId: id,
        },
        include: {
            friend: true,
        },
    });
    const friendArray = friends.map((friend) => friend.friend);
    return friendArray;
}

async function addFriend(id, friendId) {
    id = parseInt(id);
    friendId = parseInt(friendId);
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        include: {
            friends: true,
        }
    });
    const friend = await prisma.user.findUnique({
        where: {
            id: friendId,
        },
        include: {
            friends: true,
        }
    });
    if (!user || !friend) {
        return { error: 'User not found' };
    }
    if (user.friends?.includes(friendId)) {
        return { error: 'User already added' };
    }
    if (friend.friends?.includes(id)) {
        return { error: 'User already added' };
    }
    const updatedUser = await prisma.friend.create({
        data: {
            userId: id,
            friendId,
        },
    });
    const updatedFriend = await prisma.friend.create({
        data: {
            userId: friendId,
            friendId: id,
        },
    });
    return { updatedUser, updatedFriend, message: 'Friend added' };
}

async function removeFriend(id, friendId) {
    id = parseInt(id);
    friendId = parseInt(friendId);
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        include: {
            friends: true,
        },
    });
    const friend = await prisma.user.findUnique({
        where: {
            id: friendId,
        },
        include: {
            friends: true,
        },
    });
    if (!user || !friend) {
        return { error: 'User not found' };
    }
    const updatedUser = await prisma.friend.deleteMany({
        where: {
            userId: id,
            friendId,
        },
    });
    const updatedFriend = await prisma.friend.deleteMany({
        where: {
            userId: friendId,
            friendId: id,
        },
    });
    return { updatedUser, updatedFriend, message: 'Friend removed' };
}

async function listFriendRequests(id) {
    id = parseInt(id);
    const user = await prisma.user.findUnique({
        where: {
            id,
        }
    });
    const friendRequests = await prisma.user.findMany({
        where: {
            id: {
                in: user.friendRequests,
            },
        },
    });
    return friendRequests;
}

module.exports = {
    registerUser,
    login,
    getAllUsers,
    getFriends,
    addFriend,
    removeFriend,
    listFriendRequests,
};