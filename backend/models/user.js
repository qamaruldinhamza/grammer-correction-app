const users = [];

const addUser = (username, hashedPassword) => {
  users.push({ username, password: hashedPassword });
};

const findUserByUsername = (username) => {
  return users.find((user) => user.username === username);
};

module.exports = {
  addUser,
  findUserByUsername,
};