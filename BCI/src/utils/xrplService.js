import { Client, Wallet } from "xrpl";

const NETWORK = "wss://s.altnet.rippletest.net:51233";
const ISSUER_ADDRESS = "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV";
const RLUSD_HEX = toHexCurrency("RLUSD"); // Convert RLUSD to HEX format

// Convert currency to hex format if necessary
export function toHexCurrency(currency) {
    if (/^[A-F0-9]{40}$/.test(currency)) {
        return currency;
    }
    if (currency.length < 3 || currency.length > 6) {
        throw new Error("Currency code must be 3 to 6 characters long.");
    }
    let hex = Buffer.from(currency, "ascii").toString("hex").toUpperCase();
    return hex.padEnd(40, "0");
}

// Fetch RLUSD balance from trustline
export async function getRLUSDBalance(address) {
    const client = new Client(NETWORK);
    try {
        await client.connect();
        const response = await client.request({
            command: "account_lines",
            account: address,
            ledger_index: "validated",
        });

        let rlusdBalance = "0";
        if (response.result && response.result.lines) {
            const line = response.result.lines.find(
                (line) =>
                    (line.currency === "RLUSD" || line.currency === RLUSD_HEX) &&
                    line.account.toUpperCase() === ISSUER_ADDRESS.toUpperCase()
            );
            if (line) {
                rlusdBalance = line.balance;
            }
        }
        return rlusdBalance;
    } finally {
        await client.disconnect();
    }
}

// Transfer RLUSD funds
export async function transferFunds(walletData, destination) {
    const amount = await getRLUSDBalance(walletData.address);
    console.log("💰 Retrieved RLUSD amount:", amount);

    if (parseFloat(amount) <= 0) {
        throw new Error("Aucun solde RLUSD disponible pour le transfert.");
    }

    const client = new Client(NETWORK);
    try {
        await client.connect();
        const wallet = Wallet.fromSeed(walletData.secret);

        const paymentTx = {
            TransactionType: "Payment",
            Account: wallet.classicAddress,
            Destination: destination,
            Amount: {
                currency: RLUSD_HEX,
                issuer: ISSUER_ADDRESS,
                value: amount,
            },
        };

        console.log("📜 Preparing payment transaction...");
        const preparedTx = await client.autofill(paymentTx);
        const signedTx = wallet.sign(preparedTx);
        const txResponse = await client.submitAndWait(signedTx.tx_blob);

        if (txResponse.result.meta.TransactionResult !== "tesSUCCESS") {
            throw new Error(
                "Payment transaction failed: " + txResponse.result.meta.TransactionResult
            );
        }
        console.log("✅ Payment transaction successful!");
        return txResponse.result;
    } finally {
        await client.disconnect();
    }
}

// Create a temporary wallet and set trustline
export async function createTemporaryWallet() {
    const client = new Client(NETWORK);
    try {
        await client.connect();
        console.log("✅ Connected to XRPL Testnet");

        // Step 1: Generate wallet
        const wallet = Wallet.generate();
        console.log("🔑 Wallet generated:", wallet.classicAddress, wallet.seed);

        // Step 2: Fund the wallet
        const fundingResponse = await client.fundWallet(wallet);
        console.log("💰 Wallet funded. Balance:", fundingResponse.balance);

        // Step 3: Check if trustline already exists
        const accountLines = await client.request({
            command: "account_lines",
            account: wallet.classicAddress,
            ledger_index: "validated",
        });

        const trustlineExists = accountLines.result.lines.some(
            (line) => line.currency === RLUSD_HEX && line.account === ISSUER_ADDRESS
        );

        if (trustlineExists) {
            console.log("✅ Trustline already exists. Skipping setup.");
            return { address: wallet.classicAddress, secret: wallet.seed };
        }

        // Step 4: Create TrustSet Transaction
        const trustSetTx = {
            TransactionType: "TrustSet",
            Account: wallet.classicAddress,
            LimitAmount: {
                currency: RLUSD_HEX,
                issuer: ISSUER_ADDRESS,
                value: "1000000",
            },
        };

        console.log("📜 Preparing trustline transaction...");
        const preparedTx = await client.autofill(trustSetTx);
        const signedTx = wallet.sign(preparedTx);
        console.log("✍️ Signed trustline transaction:", signedTx);

        // Step 5: Submit and wait for trustline confirmation
        const txResponse = await client.submitAndWait(signedTx.tx_blob);
        if (txResponse.result.meta.TransactionResult !== "tesSUCCESS") {
            throw new Error(
                "Trustline transaction failed: " + txResponse.result.meta.TransactionResult
            );
        }

        console.log("✅ Trustline approved for RLUSD!");

        // Step 6: Verify trustline
        const verifyTrustline = await client.request({
            command: "account_lines",
            account: wallet.classicAddress,
            ledger_index: "validated",
        });

        const verified = verifyTrustline.result.lines.some(
            (line) => line.currency === RLUSD_HEX && line.account === ISSUER_ADDRESS
        );

        if (!verified) {
            throw new Error("🚨 Trustline verification failed after transaction!");
        }

        console.log("✅ Trustline successfully verified!");

        return { address: wallet.classicAddress, secret: wallet.seed };
    } finally {
        await client.disconnect();
        console.log("🔌 Disconnected from XRPL");
    }
}
