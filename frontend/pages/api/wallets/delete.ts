import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { ethers } from "ethers";


 export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const ARBITRUM_RPC = 'https://sepolia-rollup.arbitrum.io/rpc';
	const PRIVATE_KEY = '0x7d316c484191cf49b45edebfc8e75c558c670fa952f45635e42cffe00691fda3';

	if (req.method === "POST") {
		try {
	
			res.status(200).json({ result: "Valor" });
		} catch (error) {
			console.error("Error durante el despliegue:", error);
			res.status(500).json({ error: error });
		}
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
