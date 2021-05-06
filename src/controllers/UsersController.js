const User = require("../db/models/User");
const DB = require("../db/connection");
const bcrypt = require("bcrypt");
const mailController = require("./MailController");

// Cadastro de usuários
async function create(req, res) {
  const { username, email, password, confirmPassword } = req.body;
  let noUniqueEmail = false;

  // Validação de dados
  if (
    username &&
    email &&
    password &&
    confirmPassword &&
    password == confirmPassword
  ) {
    try {
      // Criação no banco de dados
      await User.create({ username, email, password });

      // Envio de email
      await mailController.sendCreateUser(email);

      return res.redirect("/login");
    } catch (error) {
      // Certifica que só há um email
      noUniqueEmail = error.message.includes(
        "UNIQUE constraint failed: Users.email"
      );
    }
  }

  // Renderização de página com erro
  return res.render("users/create", {
    error: noUniqueEmail ? undefined : "Dados inválidos",
    notLogged: true,
    username,
    email,
    noUniqueEmail,
  });
}

// Realiza login do usuário
async function login(req, res) {
  const { email, password } = req.body;

  // Consulta do usuário via o email
  const user = await DB.get(
    `
    SELECT * FROM Users
      WHERE email = ?
  `,
    [email]
  );

  // Certifica que o usuário existe
  if (!user)
    return res.render("users/login", {
      error: "Email não cadastrado",
      email,
      notLogged: true,
    });

  // Comparação de senha
  const isCorrect = await bcrypt.compare(password, user.password);

  if (isCorrect) {
    req.session.isAuth = true;
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return res.redirect("/books");
  }
  // Renderização de página com erro de login
  else {
    return res.render("users/login", {
      error: "Senha inválida",
      email,
      notLogged: true,
    });
  }
}

// Dá logout no usuário
function logout(req, res) {
  req.session.destroy();
  return res.redirect("/login");
}

module.exports = { create, login, logout };
