import { NextApiRequest, NextApiResponse } from 'next';

// Almacenar las conexiones SSE activas y sus datos
const clients: { res: NextApiResponse; wallet_id: string; }[] = [];

// Función para enviar notificaciones a un cliente específico
const broadcastEvent = (client: NextApiResponse, event: string, data: object) => {
  const message = `data: ${JSON.stringify({ event, data })}\n\n`;
  client.write(message);
};

// Función que consulta una API externa y transmite los datos a los clientes
const fetchAndBroadcast = async () => {
  for (const { res, wallet_id } of clients) {
    try {
      const response = await fetch(`https://rpc.qubic.org/v1/balances/${wallet_id}`);
      const data = await response.json();

      // Enviar los datos solo a este cliente
      broadcastEvent(res, 'new_data', data);
    } catch (error) {
      console.error(`Error al consultar la API para ${wallet_id}:`, error);
    }
  }
};

// Llama a la API cada 30 segundos
setInterval(fetchAndBroadcast, 5000);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { wallet_id } = req.body;

    // Validar que wallet_id y uri estén presentes
    if (!wallet_id || typeof wallet_id !== 'string') {
      res.status(400).json({ error: 'Se requieren wallet_id y uri válidos' });
      return;
    }

    // Configurar los headers para mantener la conexión abierta
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    console.log(`Cliente conectado con wallet_id: ${wallet_id}`);
    clients.push({ res, wallet_id });

    // Mantener viva la conexión
    const keepAlive = setInterval(() => {
      res.write(`: keep-alive\n\n`);
    }, 5000);

    // Limpiar conexión cuando el cliente se desconecta
    req.on('close', () => {
      console.log(`Cliente desconectado con wallet_id: ${wallet_id}`);
      clearInterval(keepAlive);
      const index = clients.findIndex((client) => client.res === res);
      if (index !== -1) clients.splice(index, 1);
      res.end();
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
