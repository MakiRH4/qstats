// types.ts
"use client";

export interface ChartDataPoint {
  time: string;
  value1: number;
}

export interface ActivePoint {
  time: string;
  value: number;
}
interface Event{
  event:string,
  data: QuTransaction
}
import Header from '@/components/ui/Header';
// components/TokenDashboard.tsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { QuTransaction } from '../../interface/interface.formdata';
import PreviousMap_ from 'postcss/lib/previous-map';
import { LocalStorageService } from '../../storage/storage.workflows';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  index?: number;
}

interface TokenDashboardProps {
  wallet: string;
}

const TokenDashboard: React.FC<TokenDashboardProps> = ({wallet}) => {

  const [activePoint, setActivePoint] = useState<ActivePoint>();
  
  const [walletId, setWalletId] = useState(wallet);

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-1 shadow-md rounded-md">
          <p className="text-sm">{payload[0].payload.month}</p>
          <p className="font-bold">${(payload[0].value / 100).toFixed(1)}K</p>
        </div>
      );
    }
    return null;
  };

  const CustomizedDot: React.FC<CustomDotProps> = (props) => {
    const { cx, cy, index } = props;
    
    // Highlight the specific dot (April)
    if (index === 7 && cx !== undefined && cy !== undefined) {
      return (
        <circle cx={cx} cy={cy} r={6} fill="black" stroke="white" strokeWidth={2} />
      );
    }
    return null;
  };
  const [events, setEvents] = useState<QuTransaction>();
  const [data, setData] = useState<ChartDataPoint[]>([
    
      { time: "14:00", value1: 62 },
      { time: "15:00", value1: 85 },
      { time: "16:00", value1: 23 },
      { time: "17:00", value1: 55 },
      { time: "18:00", value1: 47 },
      { time: "19:00", value1: 34 },
      { time: "20:00", value1: 77 },
      { time: "21:00", value1: 91 },
      { time: "22:00", value1: 26 },
      { time: "23:00", value1: 18 }
    ]);


  useEffect(() => {
    // Crear la conexión con el servidor de eventos SSE
    const eventSource = new EventSource('/api/transactions-events-transfer/?wallet_id='+walletId);

    // Escuchar los mensajes enviados por el servidor
    eventSource.onmessage = (event) => {
      try {
        const newEvents: Event = JSON.parse(event.data);
        console.log('Evento recibido:', newEvents.data);
  
        // Verificar si 'events' está definido y no es null
        if (newEvents.data && Array.isArray(newEvents.data.events)) {
          let newChrData: ChartDataPoint[] = [];
    
          handleNewEvents(newEvents);
        } else {
          console.error('Eventos no encontrados o mal formateados', newEvents);
        }
      } catch (error) {
        console.error('Error al procesar el evento:', error);
      }
    };

    // Manejar reconexiones automáticas en caso de error
    eventSource.onerror = () => {
      console.error('Error en la conexión SSE, intentando reconectar...');
      eventSource.close();
      setTimeout(() => {
        location.reload();
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, []);
  
  const handleNewEvents = (newEvents: Event) => {
    // Crear un conjunto para almacenar los ticks únicos
    const existingTicks = new Set(events?.events?.map((event) => event.tick)); // Suponiendo que `events` ya tiene los eventos previos
    
    const newChrData: ChartDataPoint[] = [];
  
    newEvents.data.events.forEach((item) => {
      // Verificar si el tick del evento ya existe
      if (!existingTicks.has(item.tick)) {
        // Si el tick es nuevo, agregarlo a newChrData
        const date = new Date(item.createdAt);  // Creamos un objeto Date a partir de createdAt
        const hour = date.getHours();  // Obtener la hora
        const minutes = date.getMinutes();  // Obtener los minutos
      
        const hourAndMinutes = `${hour}:${minutes < 10 ? '0' + minutes : minutes}`;  // Formato: HH:MM

        newChrData.push({
          value1: item.amount/1000,
          time: hourAndMinutes,
        });
  
        // Agregar el tick al conjunto para futuras verificaciones
        existingTicks.add(item.tick);
      }
    });
  
    // Solo actualizar el estado si hay eventos nuevos
    if (newChrData.length > 0) {
      setData(newChrData);
      setEvents(newEvents.data);  // Actualiza los eventos solo si hay eventos nuevos
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

    <Header></Header>
    <main >


    <div className="min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto p-4">

        {/* Main Content */}
        <main className="py-6">
          <h1 className="text-2xl font-bold">Token transfers</h1>
          <p className="text-sm text-gray-500 mt-1">
            ADDRESS: {walletId}
          </p>

          {/* Chart Card */}
          <div className="mt-6 border border-gray-200 rounded-lg p-6 h-1000">
            <div className="flex flex-col">
            <h2 className="text-3xl font-bold">
              {events && events?.total >= 1000 ? `${(events.total / 1000).toFixed(1)}K` : events?.total}
            </h2>
              <span className="text-gray-500">Overal Revenue</span>
            </div>

            {/* Chart */}
            <div className="relative mt-10 ">
              <div className="absolute top-0 right-24 z-10 bg-white py-1 px-3 shadow-sm rounded">
                <div className="text-sm">{activePoint?.time}</div>
                <div className="font-bold">{activePoint?.value }</div>
              </div>
              
              <div className="h-64 w-full ">
                <ResponsiveContainer width="100%" height="100%" >
                  <LineChart
                    data={data}
                    margin={{ top: 0, right: 10, left: 10, bottom: 0}}
                  >
                    <CartesianGrid strokeDasharray="1 1" vertical={false} opacity={0.2} />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis hide={true}
                              domain={[0, 'auto']}  // Ajusta el dominio para que el gráfico se ajuste dinámicamente
                              />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value1"
                      stroke="#000000"
                      strokeWidth={2.5}
                      activeDot={{ r: 8 }}
                      isAnimationActive={false}
                      connectNulls={true}
                      dot={<CustomizedDot />}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </main>

    </div>
  );
};

export default TokenDashboard;