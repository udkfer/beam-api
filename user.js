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
    const user = await prisma.user.findUnique({
        where: {
            id,
        }
    });
    const friends = await prisma.user.findMany({
        where: {
            id: {
                in: user.friends,
            },
        },
    });
    return friends;
}

async function addFriend(id, friendId) {
    const user = await prisma.user.findUnique({
        where: {
            id,
        }
    });
    const friend = await prisma.user.findUnique({
        where: {
            id: friendId,
        }
    });
    if (!user || !friend) {
        return { error: 'User not found' };
    }
    if (user.friends?.includes(friendId)) {
        return { error: 'User already added' };
    }
    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: {
            friends: {
                connect: {
                    id: friendId,
                },
            },
        },
    });
    const updatedFriend = await prisma.user.update({
        where: {
            id: friendId,
        },
        data: {
            friends: {
                connect: {
                    id,
                },
            },
        },
    });
    return { updatedUser, updatedFriend };
}

async function removeFriend(id, friendId) {
    const user = await prisma.user.findUnique({
        where: {
            id,
        }
    });
    const friend = await prisma.user.findUnique({
        where: {
            id: friendId,
        }
    });
    if (!user || !friend) {
        return { error: 'User not found' };
    }
    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: {
            friends: {
                disconnect: {
                    id: friendId,
                },
            },
        },
    });
    const updatedFriend = await prisma.user.update({
        where: {
            id: friendId,
        },
        data: {
            friends: {
                disconnect: {
                    id,
                },
            },
        },
    });
    return { updatedUser, updatedFriend };
}

async function listFriendRequests(id) {
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