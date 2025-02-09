import { Client } from "xrpl";

/**
 * Represents the WebSocket URL for connecting to the Ripple Test Network.
 *
 * This URL is used to establish a connection to the Ripple network's test environment,
 * allowing for testing and development without interacting with the main production network.
 *
 * The WebSocket protocol (wss) ensures secure communication with the endpoint provided.
 *
 * Default value: "wss://s.altnet.rippletest.net:51233".
 */
const NETWORK = "wss://s.altnet.rippletest.net:51233";
/**
 * ISSUER_ADDRESS is a constant that holds the unique identifier
 * representing the address of the issuer in a blockchain or distributed ledger.
 * This address is used to verify and validate transactions or interactions
 * associated with a specific issuer.
 *
 * It plays a critical role in ensuring trust and authenticity within the system.
 * The value of the address should not be changed during runtime.
 */
const ISSUER_ADDRESS = "rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV";
/**
 * Converts a given currency code into a hexadecimal representation. If the input
 * is already a valid 40-character hexadecimal string, it returns the currency
 * as-is. Otherwise, it converts the code to hexadecimal and pads the result
 * to 40 characters with trailing zeros.
 *
 * @param {string} currency - The currency code or existing hexadecimal string.
 * Must be a 3 to 6 character code or a valid 40-character hexadecimal string.
 * @return {string} The 40-character hexadecimal representation of the currency.
 * @throws {Error} If the currency code is not a valid 3 to 6 character string.
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
 * RLUSD_HEX is a variable that stores the hexadecimal representation of
 * the RLUSD currency symbol, obtained by converting the RLUSD identifier
 * into its hexadecimal equivalent using the toHexCurrency function.
 *
 * The variable provides a way to work with a hex-encoded format of the RLUSD
 * currency, which may be used in various systems or operations requiring
 * hexadecimal currency codes for processing or representation.
 */
const RLUSD_HEX = toHexCurrency("RLUSD");

/**
 * Handles a GET request to retrieve the XRP and RLUSD balances for a specified wallet address.
 *
 * @param {Request} req - The HTTP request object, containing the URL with a search parameter `address`
 *                        representing the wallet address to query.
 * @return {Promise<Response>} A Promise that resolves to an HTTP response object.
 *                             - If the `address` parameter is missing, returns a 400 status with an error message.
 *                             - If the request is successful, returns a 200 status with the wallet's XRP and RLUSD balances in JSON format.
 *                             - If an error occurs during the process, returns a 500 status with an error message.
 */
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
        return new Response(
            JSON.stringify({ error: "Adresse du wallet manquante." }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    const client = new Client(NETWORK);
    try {
        await client.connect();

        const xrpBalance = await client.getXrpBalance(address);

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

        return new Response(
            JSON.stringify({
                xrpBalance,
                rlusdBalance,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Erreur lors de la récupération des soldes :", error);
        return new Response(
            JSON.stringify({ error: "Erreur lors de la récupération des soldes." }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    } finally {
        await client.disconnect();
    }
}
