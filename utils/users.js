const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return { error: "you must provdie Username and Room" };
  }

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      error: "User Already Exists!",
    };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };

  
};

const getUser = (id) => {
    return users.find((user) => user.id === id)
}
  const getUserRoom = (room) => {
    return users.filter((user) => user.room === room);
  }

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }

};


export { addUser, getUser, removeUser, getUserRoom };
