import type { NextApiRequest, NextApiResponse } from 'next';
import { find } from '../form-data-db';


 export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const id = req.query;
	if (req.method === "GET") {
		try {
			if (!id  || typeof id !== 'string') {
				res.status(400).json({ error: 'Se requieren wallet_id' });
				return ;
			}
			const data = await find("SELECT * FROM wallets WHERE id = ?", [id]);
			res.status(200).json({ result: data });
		} catch (error) {
			console.error("Error durante el despliegue:", error);
			res.status(500).json({ error: error });
		}
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
