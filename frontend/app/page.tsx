"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Users, LineChart, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { Team } from "@/components/ui/team";
import { Testimonials } from "@/components/ui/testimonials"; // Importa el componente de testimonios
import Header from "./components/ui/Header";
import { FiFile, FiRefreshCw, FiBell } from 'react-icons/fi';
import { Workflow } from "./interface/interface.formdata";
import { LocalStorageService } from "./storage/storage.workflows";


function DreamChainLanding() {
   // Función para conectar MetaMask
   const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: 'Token transfers',
      walletId: 'DTPMQDHFRIRRBBZZRZSVVTIKYSVCSHSCMTMCFMFQQFCJOAMOJIYEEPJAMQML',
      lastUpdate: '22/03/2025 16:00hs',
      event: 'Email Notification',
      active: false,
      icon: <FiBell size={20} />,
    },
    {
      id: "2",
      name: 'Smart contracts executions',
      walletId: 'RPBXQFCVTFECGBVJKZTDLIECARDCWKHIJTEKUHARCABHXDSMABEFNGGHILJB',
      lastUpdate: '22/03/2025 16:00hs',
      event: 'Updating spreadsheets',
      active: true,
      icon: <FiFile size={20} />,
    },
    {
      id: "3",
      name: 'Status Updates',
      walletId: 'PWZTHHLMWUQOUAFMMCTEVRVXDHXCQKJHRGWJAKNDOFGUZVDNLMVENUMFCTYF',
      lastUpdate: '22/03/2025 16:00hs',
      event: 'CRM actions',
      active: true,
      icon: <FiRefreshCw size={20} />,
    }
  ]);
  const locstore=  new LocalStorageService();

  useEffect(() => {
    let val = locstore.getWorkflows();
    if (!val)
         locstore.saveAllWorkflows(workflows);
  }, []);

  const toggleActive = (id: string) => {
    setWorkflows(workflows.map(workflow => 
      workflow.id === id ? { ...workflow, active: !workflow.active } : workflow
    ));
  };

  return (
  <div className="min-h-screen flex flex-col bg-gray-100">
    <Header></Header>
    
      <main className="container mx-auto px-4 py-6">

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold">Workflows</h1>
            <Link href="scene">
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center text-sm">
              Configure new Flow
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
            
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ADDRESS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST UPDATE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EVENT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workflows.map((workflow) => (
                  <tr key={workflow.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {workflow.icon}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                        </div>
                      </div>
                    </td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {workflow.walletId.length > 10 ? `${workflow.walletId.slice(0, 10)}...` : workflow.walletId}
</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {workflow.lastUpdate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {workflow.event}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <label className="inline-flex relative items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={workflow.active}
                            onChange={() => toggleActive(workflow.id)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {workflow.active ? 'Active' : 'Deactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/dashboard/${workflow.walletId}`}>
                      <button  className="border border-gray-300 rounded-full px-4 py-1 text-sm">
                        Dashboard
                      </button>
                    </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>



      <footer className="py-6 px-4 border-t bg-white w-full">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <nav className="flex space-x-4 mb-4 md:mb-0">
            <Link href="#" className="text-sm text-gray-500 hover:underline">
              Sobre Nosotros
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:underline">
              Términos y Condiciones
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:underline">
              Privacidad
            </Link>
          </nav>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-500 hover:text-black">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-500 hover:text-black">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-500 hover:text-black">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </footer>
      
    </div>
  );
}

export default DreamChainLanding;
