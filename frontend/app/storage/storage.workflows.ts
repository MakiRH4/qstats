import { Workflow } from "../interface/interface.formdata";


export interface StorageService {
	saveWorkflow(user: Workflow): void;
	findWorkflowById(id: string): Workflow | null;
	deleteWorkflowById(id: string): void;
	updateWorkflowById(upDram: Workflow): Workflow | null;
	getWorkflows(): Workflow[];
}

export class LocalStorageService implements StorageService {

	// Guardar un  workflow
	saveWorkflow(workflow: Workflow): Workflow {
		const s_workflows = this.getWorkflows(); // Obtén la lista actual de usuarios
		workflow.id = crypto.randomUUID().toString();
		s_workflows.push(workflow); // Añadir el nuevo usuario
		localStorage.setItem('workflows', JSON.stringify(s_workflows)); // Guardar en LocalStorage
		console.log("Usuario guardado:", workflow);
		return workflow;
	}
	saveAllWorkflows(workflows: Workflow[]): Workflow[] {
		// Obtener los workflows actuales del localStorage
		const s_workflows = this.getWorkflows();
		workflows.forEach((workflow) => {
		  workflow.id = crypto.randomUUID().toString(); // Asignar un nuevo ID único a cada workflow
		});
		s_workflows.push(...workflows); // Usar el spread operator para agregar los workflows al array
		localStorage.setItem('workflows', JSON.stringify(s_workflows));
		console.log("Workflows guardados:", workflows);
		return workflows;
	  }
	  
  
	updateWorkflowById(upDram: Workflow): Workflow | null {
		// Obtén todos los sueños almacenados
		const workflows = this.getWorkflows();
	  
		// Verifica si el sueño con el ID proporcionado existe
		const workflowExists = workflows.some((workflow) => workflow.id === upDram.id);
		if (!workflowExists) {
		  console.error(`Workflow con ID ${upDram.id} no encontrado.`);
		  return null;
		}
	  
		// Actualiza el sueño específico
		const updatedWorkflows = workflows.map((workflow) => {
		  if (workflow.id === upDram.id) {
			return { ...workflow, ...upDram }; // Mezcla los datos existentes con los nuevos
		  }
		  return workflow;
		});
	  
		// Guarda los sueños actualizados en el LocalStorage
		localStorage.setItem('workflows', JSON.stringify(updatedWorkflows));
		console.log("Workflow actualizado:", upDram);
		return upDram;
	  }
	  
	// Buscar un  workflow por su id
	findWorkflowById(id: string): Workflow | null {
	  const users = this.getWorkflows();
	  const fromWorkflow = users.find(u => u.id === id);
	  if (fromWorkflow) {
		console.log("Workflows encontrado:", fromWorkflow);
	  } else {
		console.log("Workflows no encontrado con el id:", id);
	  }
	  return fromWorkflow || null;
	}
  
	// Eliminar un  workflow por su id
	async deleteWorkflowById(id: string): Promise<void> {
	  let users = this.getWorkflows();
	  users = users.filter(u => u.id !== id); // Filtrar el  workflow por id
	  localStorage.setItem('workflows', JSON.stringify(users)); // Guardar los cambios en LocalStorage
	  console.log(` workflow con id ${id} eliminado.`);
	}
  
	// Obtener todos los  workflows desde LocalStorage
	getWorkflows(): Workflow[] {
	  const users = localStorage.getItem('workflows');
	  return users ? JSON.parse(users) : [];
	}
  }
