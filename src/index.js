const dotenv = require("dotenv");
const express = require("express");
const session = require("express-session");
const nunjucks = require("nunjucks");
const cors = require("cors");
const { resolve } = require("path");
const routes = require("./routes");
const { authConfig } = require("./config");
const { activeLocalSession } = require("./middlewares/auth");

// Configuração de variáveis de ambiente
dotenv.config({ path: resolve(process.cwd(), "src/.env") });

// Cria instância do express
const app = express();

// Configurações iniciais
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static("public/assets"));
app.use("/css", express.static("public/css"));
app.use("/js", express.static("public/js"));
app.use("/uploads", express.static("src/uploads"));

// Autenticação
app.use(session(authConfig));
app.use(activeLocalSession);

// Cadastro de rotas
app.use(routes);

// Ativação de servidor
app.listen(8043, () => {
  console.log("Cards APP!");
});

// Configuração do NJK
nunjucks.configure("src/views", {
  autoescape: true,
  express: app,
  watch: true,
});
app.set("view engine", ".html");

console.log(process.env.EMAIL_USER);
