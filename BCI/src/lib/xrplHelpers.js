// src/lib/xrplHelpers.js
import * as xrpl from "xrpl"


/**
 * 1) Se connecter au testnet XRPL
 */
export async function getClient() {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();
    return client;
}

/**
 * 2) Générer un wallet de test via le faucet du testnet
 */
export async function generateTestWallet() {
    const client = await getClient();
    const fundResult = await client.fundWallet();
    await client.disconnect();
    return fundResult.wallet;
}

/**
 * 3) Créer un escrow
 */
export async function createEscrow(seed, amount, finishAfter) {
    const client = await getClient();
    const wallet = xrpl.Wallet.fromSeed(seed);

    const escrowCreateTx = {
        TransactionType: "EscrowCreate",
        Account: wallet.classicAddress,
        Destination: wallet.classicAddress,
        Amount: amount.toString(),      // en drops
        FinishAfter: finishAfter,       // timestamp (UNIX, en secondes)
    };

    const prepared = await client.autofill(escrowCreateTx);
    const signed = wallet.sign(prepared);
    const txResult = await client.submitAndWait(signed.tx_blob);

    await client.disconnect();
    return txResult;
}

/**
 * 4) Finaliser (release) un escrow
 */
export async function finishEscrow(seed, owner, escrowSequence) {
    const client = await getClient();
    const wallet = xrpl.Wallet.fromSeed(seed);

    const finishTx = {
        TransactionType: "EscrowFinish",
        Account: wallet.classicAddress,
        Owner: owner,
        OfferSequence: escrowSequence,
    };

    const prepared = await client.autofill(finishTx);
    const signed = wallet.sign(prepared);
    const txResult = await client.submitAndWait(signed.tx_blob);

    await client.disconnect();
    return txResult;
}
