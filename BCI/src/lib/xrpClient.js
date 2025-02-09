import { Client, Wallet } from 'xrpl';

const XRPL_NETWORK = 'wss://s.altnet.rippletest.net:51233'; // Testnet
const ISSUER_ADDRESS = 'rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV';
let client = new Client(XRPL_NETWORK);

// Connexion et déconnexion XRPL
export const connectXRPL = async () => {
    if (!client.isConnected()) {
        await client.connect();
    }
    return client;
};

export const disconnectXRPL = async () => {
    if (client.isConnected()) {
        await client.disconnect();
    }
};

// Créer une TrustLine pour RLUSD
export const createTrustLine = async (account, secret, limit = "1000000") => {
    const wallet = Wallet.fromSeed(secret);
    const trustSetTx = {
        TransactionType: 'TrustSet',
        Account: account,
        LimitAmount: {
            currency: 'RLUSD',
            issuer: ISSUER_ADDRESS,
            value: limit,
        },
    };

    const client = await connectXRPL();
    try {
        const response = await client.submitAndWait(trustSetTx, { wallet });
        return response;
    } catch (err) {
        console.error('Erreur lors de la création de la trustline:', err);
        throw new Error(err.message);
    } finally {
        await disconnectXRPL();
    }
};

// Envoyer du RLUSD
export const sendRLUSD = async (account, secret, destination, amount) => {
    const wallet = Wallet.fromSeed(secret);
    const paymentTx = {
        TransactionType: 'Payment',
        Account: account,
        Destination: destination,
        Amount: {
            currency: 'RLUSD',
            issuer: ISSUER_ADDRESS,
            value: amount,
        },
    };

    const client = await connectXRPL();
    try {
        const response = await client.submitAndWait(paymentTx, { wallet });
        return response;
    } catch (err) {
        console.error('Erreur lors de l\'envoi de RLUSD:', err);
        throw new Error(err.message);
    } finally {
        await disconnectXRPL();
    }
};
