"use client"

import { Plus } from 'lucide-react';

const PlusButton: React.FC = () => (
  <div className="flex justify-center my-2">
	<button className="rounded-full bg-white p-1 shadow-sm border border-gray-200 text-blue-500 hover:bg-blue-50 transition-colors">
	  <Plus className="h-5 w-5" />
	</button>
  </div>
);

export default PlusButton;