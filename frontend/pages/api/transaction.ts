import {QubicTransaction} from "@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction.js";
import type { NextApiRequest, NextApiResponse } from 'next';

const baseURL = 'https://rpc.qubic.org'

export async function getRPCStatus() {
    const res = await fetch(`${baseURL}/v1/status`)
    const data = await res.json()

    return data
}
// Creating and broadcasting a simple transaction
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

    const sourceId = 'PWZTHHLMWUQOUAFMMCTEVRVXDHXCQKJHRGWJAKNDOFGUZVDNLMVENUMFCTYF'
    const sourceSeed = 'tncakbmqduonvrhesikophqnzitntqpeyzcmxdpjfcghtokfnyydjhi'
    const destinationId = 'PWZTHHLMWUQOUAFMMCTEVRVXDHXCQKJHRGWJAKNDOFGUZVDNLMVENUMFCTYF'
    const amount = 10

    // Fetching current network tick
    const rpcStatus = await getRPCStatus()
    const currentTick = rpcStatus.lastProcessedTick.tickNumber

    // Scheduling transaction for a future tick
    const targetTick = currentTick + 15


    // Creating the transaction
    const tx = new QubicTransaction()
        .setSourcePublicKey(sourceId)
        .setDestinationPublicKey(destinationId)
        .setAmount(amount)
        .setTick(targetTick)

    // Signing the transaction
    await tx.build(sourceSeed)

    // Broadcasting the transaction
    const response = await broadcastTransaction(tx)
    const responseData = await response.json()

    if (!response.ok){
        console.log("Failed to broadcast transaction: ", responseData)
        return
    }

    console.log("Scheduled for tick: " + targetTick)

}

export async function broadcastTransaction(transaction: any) {

    const encodedTransaction = transaction.encodeTransactionToBase64(transaction.getPackageData())

    return await fetch(baseURL + "/v1/broadcast-transaction",
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(
                {
                    encodedTransaction: encodedTransaction
                }
            )
        });
}