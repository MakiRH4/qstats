import { NextApiRequest, NextApiResponse } from 'next';
import { handleNewEvents } from './form-data-db';

// Definición de tipos para almacenar las conexiones SSE activas y sus datos
interface Client {
  res: NextApiResponse;
  wallet_id: string;
}
interface QuTransaction {
  latestTick: number,
  total: number,
  walletId: string,
  events: Event[]
};

interface Event {
  sourceId:string,
  destinationId:string,
  transactionHash:string,
  tick:number,
  amount: number,
  eventType:number,
  createdAt: Date
}

// Almacenar las conexiones SSE activas y sus datos
const clients: Client[] = [];


// Función para enviar notificaciones a un cliente específico
const broadcastEvent = (client: NextApiResponse, event: string, data: QuTransaction) => {
  const message = `data: ${JSON.stringify({ event, data })}\n\n`;
  client.write(message);
};




// Función que consulta una API externa y transmite los datos a los clientes
const fetchAndBroadcast = async (): Promise<void> => {
  for (const { res, wallet_id } of clients) {
    try {
        const nowInSeconds = Math.floor(Date.now() / 1000); // Date.now() da milisegundos, así que dividimos entre 1000

        const response = await fetch(`https://dev02.qubic.org/gotr/api/v1/entities/${wallet_id}/events/qu-transfers`);
        const data: QuTransaction = await response.json();
        let total: number = 0; 
        if (data && data.events.length > 0){
          data.events.forEach(element => {
            const difftime = (data.latestTick - element.tick)*30;
            if (element.eventType == 0)
              total += Number(element.amount);
            element.createdAt = new Date((nowInSeconds - difftime) * 1000);
          });
          data.walletId = wallet_id;
          data.total = total;
      } else 
      {
        console.error(`No hay eventos para la wallet: ${wallet_id}:`);
        continue;
      }
        // Enviar los datos solo a este cliente
        console.log(" n transactions: "+  data.events.length)
        const result = await handleNewEvents(data)
        console.log(" Last Transactions: " + result.events.length);
        broadcastEvent(res, 'new_data', result);
    } catch (error) {
      console.error(`Error al consultar la API para ${wallet_id}:`, error);
    }
  }
};

// Llama a la API cada 5 segundos
const intervalId = setInterval(fetchAndBroadcast, 5000);

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  if (req.method === 'GET') {
    const { wallet_id } = req.query;

    // Validar que wallet_id es válido
    if (!wallet_id || typeof wallet_id !== 'string') {
      res.status(400).json({ error: 'Se requiere un wallet_id válido' });
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
