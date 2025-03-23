import { NextApiRequest, NextApiResponse } from 'next';

// Tipo del payload esperado en el WebHook
interface WebHookPayload {
  event: string;
  data: Record<string, unknown>;
}

// Referencia global para el stream (SSE)
declare global {
  var eventStream: NextApiResponse | null;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const payload: WebHookPayload = req.body;

    // Validar la estructura del WebHook
    if (!payload || !payload.event) {
      return res.status(400).json({ error: 'Payload inválido' });
    }

    console.log('Webhook recibido:', payload);

    // Emitir evento al cliente (si hay conexión activa)
    if (global.eventStream) {
      global.eventStream.write(`data: ${JSON.stringify(payload)}\n\n`);
    }

    res.status(200).json({ message: 'Webhook procesado' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}
