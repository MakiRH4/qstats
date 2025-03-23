// src/pages/contract-workflow.tsx
"use client"

import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import ContractTriggerSidebar from '@/components/ui/ContractTriggerSidebar';
import Header from '@/components/ui/Header';
import React from 'react';
import { Hand, FileText, Mail, Code } from 'lucide-react';
import VerticalConnector from '@/components/VerticalConnector';
import PlusButton from '@/components/ui/PlusButton';
import WorkflowNode from '@/components/ui/WorkflowNode';
import { QuTransaction } from '../interface/interface.formdata';
import { toast, ToastContainer } from 'react-toastify';



enum Type {
	TRANSFER
}

interface ConfigTrigger {
	walletId: string,
	type:Type,
}

interface Event{
	event:string,
	data: QuTransaction
}

interface MailState{
	success: boolean,
	error: boolean,
	loading: boolean,
}
const ContractWorkflowPage: NextPage = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [triggerconf, setTriggerconf] = useState<ConfigTrigger>();
	const [transaction, setTransaction] = useState<QuTransaction>();
	const [loadingMail, setLoadingMail] = useState(false);
	const [loadingRefill, setLoadingRefill] = useState(false);

	function open_panel(){
		setSidebarOpen(!sidebarOpen);
	}

	useEffect(() => {
		if (!triggerconf)
				return;
			console.log("intentando conectar..." + triggerconf?.walletId);
			// Crear la conexión con el servidor de eventos SSE
			const eventSource = new EventSource("http://localhost:3000/api/transactions-events-last-transfer/?wallet_id="+ triggerconf?.walletId);
	
			// Escuchar los mensajes enviados por el servidor
			eventSource.onmessage = async (event) => {
				try {
					const newEvents: Event = JSON.parse(event.data);
		
				 // console.log('Evento recibido:', newEvents.data);
					// Verificar si 'events' está definido y no es null
					if (newEvents.data && Array.isArray(newEvents.data.events)) {
						setTransaction(newEvents.data);
						if (newEvents.data.events.length > 0)
						{
							console.log('Evento recibido:', newEvents.data.events.length);
							sendEmail(newEvents.data);
						}

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
			};
	
			return () => {
				eventSource.close();
			};
	}, [triggerconf]);

	function saveTrigger(address: string, type: number) {
		toast.success('Listening wallet id: !' + address, {
			position: 'top-right',
			autoClose: 3000,
			className: 'bg-green-500 text-white shadow-lg',
		});

		setTriggerconf({walletId: address, type: type});
		setSidebarOpen(false);
	}
	function sendEmail( newEvents: QuTransaction | null)  {
		
		toast.success('¡Email enviado!', {
			position: 'top-right',
			autoClose: 3000,
			className: 'bg-green-500 text-white shadow-lg',
		});
			setLoadingMail(true);
			try {
				const val = fetch("http://localhost:3000/api/mailsender/",{ method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						subject: "Number of last transactions: " + (newEvents?.events.length ?? 0),
						body: (newEvents == null || !newEvents?.events.length) 
							? "No hay mensajes" 
							: `Número de eventos: ${newEvents.events.length}\nDetalles: ${JSON.stringify(newEvents.events)}`
					}),
				});
			} catch (err){
				setLoadingMail(false);
			} 
			setLoadingMail(false);
	}
	function callRefill()  {
		toast.success('Refill wallet!', {
			position: 'top-right',
			autoClose: 3000,
			className: 'bg-green-500 text-white shadow-lg',
		});
				setLoadingRefill(true);
			try {
				const val = fetch("http://localhost:3000/api/transaction",{ method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({  wallet_id:triggerconf?.walletId}),
				});
			} catch (err){
				setLoadingRefill(false);
			} 
			setLoadingRefill(false);
	}
	return (
		<>
			<Head>
				<title>Contract Workflow | Flow Designer</title>
				<meta name="description" content="Design workflows triggered by blockchain contracts" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			
			<style jsx global>{`
				.bg-pattern {
					background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
					background-size: 24px 24px;
				}
			`}</style>
			
			<div className="min-h-screen bg-pattern relative">
				{/* Header */}
				<Header></Header>        
				{/* Main Content */}
				<main className="py-6">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

						
						{/* Workflow Diagram */}
		<div className="bg-gray-50 bg-pattern min-h-screen p-6 flex justify-center">
			<div className="flex flex-col items-center max-w-3xl">
				{/* Node 1 */}
				<a  onClick={() => open_panel()}
	className="block cursor-pointer transition-transform duration-200 hover:scale-105 group"
>
					<WorkflowNode 
						loading = {false}
						title="QStat Trigger" 
						icon={<Hand className="w-5 h-5 text-white bg-blue-500 rounded-sm p-0.5" />}
						borderColor="border-blue-500"
						showEyeIcon={false}
					/>
				</a>
				{/* Connector and Plus button */}
				<VerticalConnector />
				<PlusButton />
				<VerticalConnector />
				
				{/* Node 2 */}
				
				<a  onClick={() => sendEmail()}
				className="block cursor-pointer transition-transform duration-200 hover:scale-105 group"
				>
				<WorkflowNode 
					title="Send Email"

					loading = {loadingMail}
					icon={<Mail className="w-5 h-5 text-white bg-blue-500 rounded-sm p-0.5" />}
					borderColor="border-blue-500"
					showEyeIcon={false}
				/>
				</a>
				{/* Connector and Plus button */}
				<VerticalConnector />
				<PlusButton />
				<VerticalConnector />
				
				{/* Node 3 */}
				<WorkflowNode 
					title="If amount < 1000"
					loading = {false}
					isCondition={true}
					conditionValue="True"
					icon={<Code className="w-5 h-5 text-white bg-blue-500 rounded-sm p-0.5" />}
					borderColor="border-blue-500"
					showEyeIcon={false}
				/>
				
				{/* Connector and Plus button */}
				<VerticalConnector />
				<PlusButton />
					<a  onClick={() => callRefill()}
				className="block cursor-pointer transition-transform duration-200 hover:scale-105 group"
				>
				<WorkflowNode 
					title="Refill Wallet"
					loading = {loadingRefill}
					icon={<FileText className="w-5 h-5 text-white bg-blue-500 rounded-sm p-0.5" />}
					borderColor="border-blue-500"
					showEyeIcon={false}
				/>
				</a>
				{/* Connector and Plus button */}
				<VerticalConnector />
				<PlusButton />
				


			</div>
		</div>
					</div>
				</main>
				
				{/* Sidebar */}
				<ContractTriggerSidebar 
					isOpen={sidebarOpen} 
					onClose={() => setSidebarOpen(false)} 
					onSave={(val, type) => saveTrigger(val, type)} 
				/>
			</div>
			<ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeButton={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
		</>
		
	);
};

export default ContractWorkflowPage;