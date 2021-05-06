const { diskStorage } = require("multer");
const { resolve } = require("path");

// Objeto de configuração do multer (para uploads de arquivos estáticos)
const multerConfig = {
  storage: diskStorage({
    destination: resolve(__dirname, "uploads"),
    filename: (request, file, callback) => {
      callback(null, Date.now() + "-" + file.originalname);
    },
  }),
};

// Configuração do sistema de autenticação
const authConfig = {
  secret: "senha",
  resave: true,
  saveUninitialized: true,
};

// Configuração de email
async function mailConfig() {
  const config = {
    tls: {
    rejectUnauthorized: false
    },
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE == "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  return config;
}

module.exports = { multerConfig, authConfig, mailConfig };
