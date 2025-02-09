import { transferFunds, getRLUSDBalance } from "../../../utils/xrplService";
import fs from "fs";
import path from "path";

/**
 * Represents the file path to the tontines JSON data file.
 * The file path is dynamically resolved based on the current working directory
 * of the Node.js process, ensuring the correct location is used regardless of where
 * the application is executed.
 *
 * This path is constructed by joining the current working directory with the
 * relative path "data/tontines.json".
 *
 * This variable is intended to be used for interactions with the tontines data file,
 * such as reading or writing data.
 */
const tontinesFile = path.join(process.cwd(), "data", "tontines.json");

/**
 * Handles the GET request to process tontine transactions. It checks the status and scheduled time
 * of tontines, initiates fund transfers if conditions are met, updates their status, and writes the
 * changes to a file. Returns a response based on the outcome.
 *
 * @param {Request} request - The incoming HTTP request object.
 * @return {Promise<Response>} - A promise that resolves to the HTTP response indicating the result
 * of the operation. The response includes a success message with transfer results on success or an
 * error message on failure.
 */
export async function GET(request) {
    try {
        let tontines = [];
        if (fs.existsSync(tontinesFile)) {
            const data = fs.readFileSync(tontinesFile, "utf8").trim();
            tontines = data ? JSON.parse(data) : [];
        }

        const now = new Date();
        let updated = false;
        const results = [];

        for (const tontine of tontines) {
            if (
                tontine.status === "active" &&
                new Date(tontine.scheduledTime) <= now
            ) {
                console.log(`💡 Processing tontine ${tontine.id}`);

                const balance = await getRLUSDBalance(tontine.wallet.address);
                console.log(
                    `💰 RLUSD balance for wallet ${tontine.wallet.address}: ${balance}`,
                );

                if (parseFloat(balance) <= 0) {
                    console.log(
                        `⚠️ Aucun solde RLUSD disponible pour le wallet ${tontine.wallet.address}. Transfert ignoré.`,
                    );
                    continue;
                }

                console.log(
                    `🔄 Initiating transfer from ${tontine.wallet.address} to ${tontine.destination}`,
                );
                const txResult = await transferFunds(
                    tontine.wallet,
                    tontine.destination,
                );
                tontine.status = "completed";
                tontine.transferredAt = new Date().toISOString();
                tontine.txResult = txResult;
                updated = true;
                results.push({ id: tontine.id, status: "completed", txResult });
            }
        }

        if (updated) {
            fs.writeFileSync(tontinesFile, JSON.stringify(tontines, null, 2));
        }

        return new Response(
            JSON.stringify({ message: "Transferts effectués.", results }),
            { status: 200, headers: { "Content-Type": "application/json" } },
        );
    } catch (error) {
        console.error("Erreur lors du déclenchement des transferts :", error);
        return new Response(
            JSON.stringify({ error: "Erreur lors du déclenchement des transferts." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
}
