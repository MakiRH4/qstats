"use client"
import {  ChevronDown, ChevronUp, Hand, FileText, Mail } from 'lucide-react';

interface WorkflowNodeProps {
  title: string;
  icon: React.ReactNode;
  borderColor?: string;
  showPlusButton?: boolean;
  showEyeIcon?: boolean;
  isCondition?: boolean;
  isConditionResult?: boolean;
  conditionValue?: string;
  loading: boolean;
}


const WorkflowNode: React.FC<WorkflowNodeProps> = ({
  title,
  icon,
  borderColor = 'border-blue-500',
  showPlusButton = true,
  showEyeIcon = false,
  isCondition = false,
  isConditionResult = false,
  loading = false,
  conditionValue
}) => {
  const getBgColor = () => {
	if (isCondition) return 'bg-gray-700 text-white';
	if (isConditionResult) {
	  if (conditionValue === 'True') return 'bg-green-600 text-white';
	  if (conditionValue === 'False') return 'bg-red-600 text-white';
	}
	return 'bg-white';
  };

  const getWidth = () => {
	if (isCondition) return 'w-64';
	if (isConditionResult) return 'w-32';
	return 'w-64';
  };

  return (
	<div 
	  className={`${getWidth()} relative ${isCondition ? 'rounded' : 'rounded-sm'} shadow-sm overflow-hidden`}
	>
	  <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderColor}`}></div>
	  <div className={`flex items-center p-3 ${getBgColor()}`}>
		<div className="flex-shrink-0 mr-3">
		  {icon}
		</div>
		<div className="flex-grow">
		  <h3 className={`text-sm font-medium ${isCondition || isConditionResult ? 'text-white' : 'text-gray-800'}`}>
			{title}
		  </h3>
		</div>
		{isCondition && (
		  <div className="flex-shrink-0 ml-2">
			<ChevronDown className="w-5 h-5 text-white" />
		  </div>
		)}
		{isConditionResult && (
		  <div className="flex-shrink-0 ml-2">
			<ChevronUp className="w-5 h-5 text-white" />
		  </div>
		)}
		{showEyeIcon && (
		  <div className="flex-shrink-0 ml-2">
			<svg 
			  xmlns="http://www.w3.org/2000/svg" 
			  className="h-5 w-5 text-gray-400" 
			  fill="none" 
			  viewBox="0 0 24 24" 
			  stroke="currentColor"
			>
			  <path 
				strokeLinecap="round" 
				strokeLinejoin="round" 
				strokeWidth={2} 
				d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
			  />
			  <path 
				strokeLinecap="round" 
				strokeLinejoin="round" 
				strokeWidth={2} 
				d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
			  />
			</svg>
		  </div>
		)}
		{loading && (
		<div className="flex-shrink-0 ml-2 animate-spin">
			<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-5 w-5 text-gray-400"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			>
			<circle
				className="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
			/>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
			/>
			</svg>
		</div>
		)}

	  </div>
	</div>
  );
};


export default WorkflowNode;