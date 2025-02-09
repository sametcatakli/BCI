import { Client } from "xrpl";

/**
 * Represents the WebSocket URL endpoint for connecting to the Ripple Testnet.
 * This constant defines the network address used for establishing a connection to the Ripple Testnet.
 * It is set to use the WebSocket Secure (wss) protocol on port 51233.
 */
const NETWORK = "wss://s.altnet.rippletest.net:51233";
/**
 * Represents the address of the issuer involved in a transaction or authorization process.
 *
 * This variable holds the unique identifier for the issuer, typically used for
 * verifying ownership, facilitating transactions, or establishing trust in
 * decentralized systems or blockchain networks.
 *
 * The value is immutable and must remain consistent throughout its usage to
 * ensure integrity and reliability of processes relying on this identifier.
 */
const ISSUER_ADDRESS = "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV";

/**
 * Converts a currency code to a padded hexadecimal representation.
 *
 * @param {string} currency - The currency code to be converted. It must be a string
 * between 3 to 6 characters long or a valid 40-character hexadecimal string.
 * @return {string} A 40-character hexadecimal string representation of the currency code,
 * padded with zeroes if necessary.
 * @throws {Error} If the currency code is not 3 to 6 characters long or invalid.
 */
function toHexCurrency(currency) {
    if (/^[A-F0-9]{40}$/.test(currency)) return currency;
    if (currency.length < 3 || currency.length > 6) {
        throw new Error("Currency code must be 3 to 6 characters long.");
    }
    return Buffer.from(currency, "ascii").toString("hex").toUpperCase().padEnd(40, "0");
}

/**
 * Handles an HTTP POST request to fetch XRP wallet balances and trustline information from the XRPL network.
 *
 * @param {Request} req - The HTTP request object, containing a JSON payload with the XRP wallet address.
 * @return {Promise<Response>} A promise resolving to an HTTP response. On success, returns a response with status 200 and a JSON object containing `xrpBalance` and `rlusdBalance`. On error, returns a response with a respective error message and status codes 400 or 500.
 */
export async function POST(req) {
    const { address } = await req.json();

    if (!address || !address.startsWith("r")) {
        return new Response(
            JSON.stringify({ error: "Adresse XRP invalide. Elle doit commencer par 'r'." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const client = new Client(NETWORK);
    try {
        await client.connect();

        console.log(`🔍 Récupération des soldes pour le wallet : ${address}`);

        const xrpBalance = await client.getXrpBalance(address);
        const response = await client.request({
            command: "account_lines",
            account: address,
            ledger_index: "validated",
        });

        console.log("📊 Trustlines reçues :", JSON.stringify(response.result.lines, null, 2));

        let rlusdBalance = "0";
        const RLUSD_HEX = toHexCurrency("RLUSD");
        const trustline = response.result.lines.find(
            (line) =>
                line.currency === RLUSD_HEX &&
                line.account.toUpperCase() === ISSUER_ADDRESS.toUpperCase()
        );

        if (trustline) {
            rlusdBalance = trustline.balance;
        }

        return new Response(
            JSON.stringify({
                xrpBalance,
                rlusdBalance,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des soldes :", error);
        return new Response(
            JSON.stringify({ error: "Erreur lors de la récupération des soldes" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    } finally {
        await client.disconnect();
        console.log("🔌 Déconnecté du réseau XRPL");
    }
}
