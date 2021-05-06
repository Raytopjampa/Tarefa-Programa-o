const bcrypt = require("bcrypt");
const DB = require("../connection");

/**
 * Cadastra um novo usuário
 * @param {{ username: string, email: string, password: string }} data
 */
async function create(data) {
  const { username, email, password } = data;

  const hash = await bcrypt.hash(password, 10);

  const { lastId } = await DB.run(
    `
    INSERT INTO Users
      (username, email, password)
    VALUES
      (?, ?, ?)
  `,
    [username, email, hash]
  );

  return lastId;
}

module.exports = { create };
