import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Html } from 'next/document';
const MAX_LENGTH = 1000; // Definir el límite de caracteres

// Cargar las variables de entorno desde .env
dotenv.config();

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const {subject, body} = req.body;

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

  const bodyAsString =  JSON.stringify(body);
  const truncatedBody: string = bodyAsString.length > MAX_LENGTH 
    ? bodyAsString.slice(0, MAX_LENGTH) + '...' 
    : bodyAsString;

    const value = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Email Alert</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    </head>
    <body style="font-family: 'Inter', sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
    
      <div style="max-width: 500px; margin: auto; background-color: white; padding: 20px; border-radius: 10px; 
                  box-shadow: 0px 2px 10px rgba(0,0,0,0.1); font-family: 'Inter', sans-serif;">
        
        <h2 style="color: #333; font-weight: 600;">Notification Alert </h2>
    
        <div style="padding: 15px; border-radius: 8px; color: white; font-size: 16px; font-weight: 400;">
        Transfers were made with the wallet
        </div>
    
        <p style="color: #555; margin-top: 15px; font-size: 14px; font-weight: 400;">
          If you have any questions, please contact our support team.
        </p>
    
        <a style="display: inline-block; margin-top: 10px; padding: 10px 15px; 
            background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: 600;">
          Visit Our Website
        </a>
    
      </div>
    
    </body>
    <footer>
    <h3>${truncatedBody}</h3>
    </footer>
    </html>`;
  try {
    // Enviar el correo
    const info = await transporter.sendMail({
      from: process.env.USER_EMAIL,       // Remitente
      to: process.env.USER_EMAIL,         // Destinatario (puedes cambiarlo)
      subject: subject,                   // Asunto del correo
      html: value,                         // Cuerpo del mensaje en texto plano
    });

    console.log('✅ Correo enviado: ', info.messageId);
	
    res.status(200).end(`Correo enviado`);
  } catch (error) {
    console.error('❌ Error al enviar el correo: ', error);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}

// Ejemplo de uso
