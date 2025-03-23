import {QubicTransaction} from "@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction.js";

const baseURL = 'https://rpc.qubic.org'

export async function getRPCStatus() {
    const res = await fetch(`${baseURL}/v1/status`)
    const data = await res.json()

    console.log(JSON.stringify(data, null, 2))

    return data
}
// Creating and broadcasting a simple transaction
export async function simpleTransaction() {

    const sourceId = 'DTPMQDHFRIRRBBZZRZSVVTIKYSVCSHSCMTMCFMFQQFCJOAMOJIYEEPJAMQML'
    const sourceSeed = 'jnqavkvdoitzafbqicshhptvligatcwoaqnytxvbdutiicluxsfoclc'
    const destinationId = 'PWZTHHLMWUQOUAFMMCTEVRVXDHXCQKJHRGWJAKNDOFGUZVDNLMVENUMFCTYF'
    const amount = 2700

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

    console.log("Successfully broadcast transaction.")
    console.log("Transaction ID: " + responseData.transactionId)
    console.log("Scheduled for tick: " + targetTick)

}

await simpleTransaction()

export async function broadcastTransaction(transaction) {

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