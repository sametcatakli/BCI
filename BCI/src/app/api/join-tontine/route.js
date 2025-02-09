import fs from 'fs/promises';
import path from 'path';

/**
 * Represents the file path to the JSON data file that stores information
 * related to tontines. The file path is constructed by joining the current
 * working directory with the 'data' folder and the 'tontines.json' file.
 */
const dataFilePath = path.join(process.cwd(), 'data', 'tontines.json');

/**
 * Handles a POST request to allow a user to join a tontine. The function validates the incoming
 * request, checks if the tontine ID and user ID are provided, and processes the addition of the user
 * to the specified tontine. If successful, it updates the tontine data and returns a success response.
 *
 * Performs the following steps:
 * - Parses the JSON payload from the request to extract `tontineId` and `userId`.
 * - Validates the presence of `tontineId` and `userId`.
 * - Ensures the data file for tontines exists and is accessible.
 * - Searches for the specified tontine based on `tontineId`.
 * - Verifies that the user is not already a member.
 * - Adds the user to the tontine members list and updates the data file.
 *
 * @param {Request} req - The incoming HTTP request for the POST method. The request must have a JSON body containing `tontineId` and `userId`.
 *
 * @return {Promise<Response>} A Response object representing the result of the operation:
 * - 200: If the user has successfully joined the tontine.
 * - 400: If required parameters are missing or the user is already a member.
 * - 404: If the specified tontine does not exist.
 * - 500: For internal server errors or missing data files.
 */
export async function POST(req) {
    try {
        const { tontineId, userId } = await req.json();
        if (!tontineId || !userId) {
            return new Response(
                JSON.stringify({ error: '❌ Champs manquants : tontineId ou userId' }),
                { status: 400 }
            );
        }
        try {
            await fs.access(dataFilePath);
        } catch (err) {
            return new Response(JSON.stringify({ error: '❌ Fichier de données tontines non trouvé' }), {
                status: 500,
            });
        }
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const tontines = JSON.parse(data);
        const tontine = tontines.find((t) => t.id === tontineId);

        if (!tontine) {
            return new Response(
                JSON.stringify({ error: '❌ Tontine introuvable. Vérifiez l\'ID.' }),
                { status: 404 }
            );
        }
        if (tontine.members.includes(userId)) {
            return new Response(
                JSON.stringify({ error: '⚠️ L\'utilisateur est déjà membre de cette tontine' }),
                { status: 400 }
            );
        }
        tontine.members.push(userId);
        await fs.writeFile(dataFilePath, JSON.stringify(tontines, null, 2), 'utf-8');

        return new Response(
            JSON.stringify({
                message: '✅ L\'utilisateur a rejoint la tontine avec succès !',
                tontine: {
                    id: tontine.id,
                    name: tontine.name,
                    cycleSize: tontine.cycleSize,
                    members: tontine.members,
                },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('❌ Erreur dans join-tontine:', error);
        return new Response(
            JSON.stringify({ error: '⚠️ Erreur interne du serveur' }),
            { status: 500 }
        );
    }
}
