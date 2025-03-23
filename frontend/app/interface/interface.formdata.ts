import { Numeric } from "ethers";

export interface Contract {
	dir_contract: string
}

export interface Transactions {
	address: string,

}
export interface Donor {
	name: string,
	address: string,
	amount: number,
}

export interface QuTransaction {
  latestTick: number,
  total:number,
  walletId: string,
  events: Event[]
};

export interface Event {
  sourceId:string,
  destinationId:string,
  transactionHash:string,
  tick:number,
  amount: number,
  eventType:number,
  createdAt: Date
}

export interface Mentor {
	name: string,
	address: string,
	specialty: string,
}

export interface Workflow {
  id: string;
  name: string;
  walletId: string;
  lastUpdate: string;
  event: string;
  active: boolean,
  icon: React.ReactNode;
}



export interface Dream {
	id?: string;
	name_dream: string;
	dream_description: string;
	dream_goals: string;
	dream_reward_offered: string;
	contract: string;
	goal_amount : number;
	donated_amount: number;
	donors?: Donor[];
	mentors?: Mentor[];
  }

