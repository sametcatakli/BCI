import { createTemporaryWallet } from "@/utils/xrplService";
import fs from "fs";
import path from "path";

/**
 * The resolved file path to the "data" directory, constructed by joining the current working directory
 * with the "data" subdirectory. This is typically used as a base path for reading or writing files
 * related to application data storage.
 */
const dataPath = path.join(process.cwd(), "data");
/**
 * Represents the file path to the "tontines.json" file.
 * This file is used to store or retrieve data related to tontines.
 * Combines the base directory specified by `dataPath` with the filename "tontines.json".
 */
const tontinesFile = path.join(dataPath, "tontines.json");

/**
 * Handles the creation of a tontine by processing a POST request. Validates request data, creates a temporary wallet, and saves the tontine details to storage.
 *
 * @param {Request} request - The HTTP request object containing tontine details in its JSON payload. The properties required are:
 * - tontineName: The name of the tontine.
 * - destination: The intended usage or purpose of the tontine funds.
 * - scheduledTime: The planned schedule or time for the tontine.
 * - userId: The ID of the user creating the tontine.
 *
 * @return {Response} Returns a response object indicating the success or failure of the operation. If successful, it includes details such as tontine ID and wallet address. Otherwise, an appropriate error message is returned.
 */
export async function POST(request) {
    try {
        const { tontineName, destination, scheduledTime, userId } = await request.json();

        if (!tontineName || !destination || !scheduledTime || !userId) {
            console.error("❌ Champs manquants :", { tontineName, destination, scheduledTime, userId });
            return new Response(
                JSON.stringify({ error: "Tous les champs sont requis (tontineName, destination, scheduledTime, userId)." }),
                { status: 400 }
            );
        }

        console.log("📥 Données reçues :", { tontineName, destination, scheduledTime, userId });

        const wallet = await createTemporaryWallet();

        const tontineRecord = {
            id: Date.now().toString(),
            tontineName,
            destination,
            scheduledTime,
            tontineMaster: userId,
            wallet: {
                address: wallet.address,
                secret: wallet.secret,
            },
            createdAt: new Date().toISOString(),
            status: "active",
            members: [userId],
        };

        let tontines = [];
        if (fs.existsSync(tontinesFile)) {
            const data = fs.readFileSync(tontinesFile, "utf8").trim();
            if (data) {
                tontines = JSON.parse(data);
            }
        }

        tontines.push(tontineRecord);
        fs.writeFileSync(tontinesFile, JSON.stringify(tontines, null, 2));
        console.log("✅ Tontine créée avec succès !");
        return new Response(
            JSON.stringify({
                message: "Tontine créée avec succès !",
                tontineId: tontineRecord.id,
                walletAddress: wallet.address,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("❌ Erreur lors de la création de la tontine :", error);
        return new Response(
            JSON.stringify({ error: "Erreur lors de la création de la tontine." }),
            { status: 500 }
        );
    }
}
