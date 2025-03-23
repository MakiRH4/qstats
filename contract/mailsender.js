import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde .env
dotenv.config();

async function handler(subject, body ) {

  // Configuración del transportador (SMTP de Gmail)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true para 465, false para 587
    auth: {
      user: process.env.USER_EMAIL,        // Tu correo
      pass: process.env.PASS_APP_EMAIL,    // Contraseña de aplicación
    },
  });

  try {
    // Enviar el correo
    const info = await transporter.sendMail({
      from: process.env.USER_EMAIL,       // Remitente
      to: process.env.USER_EMAIL,         // Destinatario (puedes cambiarlo)
      subject: subject,                   // Asunto del correo
      text: body,                         // Cuerpo del mensaje en texto plano
    });

    console.log('✅ Correo enviado: ', info.messageId);
  } catch (error) {
    console.error('❌ Error al enviar el correo: ', error);
  }
}

// Ejemplo de uso
await handler("Holaaa", "Como estas?");