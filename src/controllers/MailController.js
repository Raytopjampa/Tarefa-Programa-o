const nodemailer = require("nodemailer");
const { mailConfig } = require("../config");

// Envia email com dados de criação de usuário
async function sendCreateUser(to) {
  try {
    const config = await mailConfig();

    const transporter = nodemailer.createTransport(config);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Conta criada no Notpads",
      text: `Conta criada com sucesso.\n\nAcesse o aplicativo.`,
      html: `<h1>Conta criada com sucesso.</h1><p>Acesse o aplicativo.</p>`,
    });

    console.log(`Send email: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (err) {
    console.error(err);
  }
}

module.exports = { sendCreateUser };
