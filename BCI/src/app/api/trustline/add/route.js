import { Client, Wallet } from "xrpl";

/**
 * The WebSocket URL for connecting to the Ripple test network.
 * This variable represents the endpoint for establishing communication
 * with the Ripple test server over a secure WebSocket (wss) protocol.
 */
const NETWORK = "wss://s.altnet.rippletest.net:51233";
/**
 * ISSUER_ADDRESS is a constant variable that represents the unique address
 * of the issuer in a decentralized or blockchain-based network. It is typically
 * used to identify the source or creator of a specific asset, token, or transaction.
 *
 * This address is immutable and serves as an identifier for validating and
 * authenticating operations that involve the associated issuer.
 */
const ISSUER_ADDRESS = "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV";

/**
 * Converts a currency code to its hexadecimal representation padded to 40 characters.
 * This method ensures that valid hexadecimal currency codes are returned as-is,
 * while standard currency codes are converted to their hexadecimal format.
 *
 * @param {string} currency - The currency code to be converted. It can be a valid
 * hexadecimal string of length 40 or a standard currency code with a length between
 * 3 and 6 characters.
 * @return {string} The hexadecimal representation of the currency code, padded to 40 characters.
 * @throws {Error} If the currency code is not a valid hexadecimal or the length is not
 * between 3 and 6 characters.
 */
function toHexCurrency(currency) {
    if (/^[A-F0-9]{40}$/.test(currency)) {
        return currency;
    }
    if (currency.length < 3 || currency.length > 6) {
        throw new Error("Currency code must be 3 to 6 characters long.");
    }
    let hex = Buffer.from(currency, "ascii").toString("hex").toUpperCase();
    return hex.padEnd(40, "0");
}

/**
 * Handles a POST request to add or verify a trustline for a specific wallet address.
 *
 * @param {Request} req - The incoming HTTP request object, which should contain a JSON body with `tontineWalletAddress` and `tontineSecret` fields.
 * @return {Promise<Response>} Returns a Response object. The response contains a success message and trustline details if the operation succeeds,
 *                             or an error message with the appropriate status code if the operation fails.
 */
export async function POST(req) {
    try {
        const { tontineWalletAddress, tontineSecret } = await req.json();
        if (!tontineWalletAddress || !tontineSecret) {
            return new Response(
                JSON.stringify({ error: "Adresse et secret du wallet requis." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const client = new Client(NETWORK);
        await client.connect();
        const response = await client.request({
            command: "account_lines",
            account: tontineWalletAddress,
            ledger_index: "validated",
        });
        const existingTrustline = response.result.lines.find(
            (line) => line.currency === toHexCurrency("RLUSD") && line.account.toUpperCase() === ISSUER_ADDRESS.toUpperCase()
        );

        if (existingTrustline) {
            await client.disconnect();
            return new Response(
                JSON.stringify({
                    message: "✅ Trustline déjà existante.",
                    trustline: {
                        currency: "RLUSD",
                        issuer: existingTrustline.account,
                        balance: existingTrustline.balance,
                        limit: existingTrustline.limit,
                    },
                }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        const wallet = Wallet.fromSeed(tontineSecret);
        const trustSetTx = {
            TransactionType: "TrustSet",
            Account: wallet.classicAddress,
            LimitAmount: {
                currency: toHexCurrency("RLUSD"),
                issuer: ISSUER_ADDRESS,
                value: "1000000",
            },
        };
        const preparedTx = await client.autofill(trustSetTx);
        const signedTx = wallet.sign(preparedTx);
        const txResponse = await client.submitAndWait(signedTx.tx_blob);
        await client.disconnect();

        if (txResponse.result.meta.TransactionResult !== "tesSUCCESS") {
            return new Response(
                JSON.stringify({ error: "Trustline transaction failed." }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ message: "✅ Trustline ajoutée avec succès !" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Erreur lors de l'ajout de la Trustline:", error);
        return new Response(
            JSON.stringify({ error: "Erreur lors de l'ajout de la Trustline." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
