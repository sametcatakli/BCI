import fs from 'fs/promises';
import path from 'path';

/**
 * The file path to the Tontines data file.
 * Combines the current working directory with the specified
 * subdirectory and file name.
 * Utilized to access or store Tontines-related data in JSON format.
 * Useful for reading or writing structured data within the application.
 */
const dataFilePath = path.join(process.cwd(), 'data', 'tontines.json');

/**
 * Handles an HTTP POST request to allow a user to join a tontine and establish a trustline.
 *
 * This method processes the request to verify the provided tontine ID and user ID. It checks
 * if the tontine exists and ensures the user is not already a member. Once verified, it
 * establishes a trustline for the tontine and updates the tontine's member data.
 *
 * @param {Request} req The HTTP request object containing a JSON payload with the `tontineId` and `userId`.
 * @return {Promise<Response>} The HTTP response with the result of the operation:
 * - On success, returns a JSON response with the updated tontine data and trustline details.
 * - On failure, returns an appropriate error message with a relevant HTTP status code.
 */
export async function POST(req) {
    try {
        const { tontineId, userId } = await req.json();
        if (!tontineId || !userId) {
            return new Response(
                JSON.stringify({ error: '❌ Missing tontineId or userId' }),
                { status: 400 }
            );
        }
        try {
            await fs.access(dataFilePath);
        } catch (err) {
            return new Response(JSON.stringify({ error: '❌ Tontine data file not found' }), {
                status: 500,
            });
        }
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const tontines = JSON.parse(data);
        const tontine = tontines.find((t) => t.id === tontineId);
        if (!tontine) {
            return new Response(
                JSON.stringify({ error: '❌ Tontine not found. Please check the ID.' }),
                { status: 404 }
            );
        }
        if (tontine.members.includes(userId)) {
            return new Response(
                JSON.stringify({ error: '⚠️ User is already a member of this tontine' }),
                { status: 400 }
            );
        }
        const tontineWalletAddress = tontine.wallet.address;
        const tontineSecret = tontine.wallet.secret;
        console.log(`🔎 Vérification du wallet de la tontine: ${tontineWalletAddress}`);
        console.log(`🔗 Demande de Trustline pour ${tontineWalletAddress}...`);
        const trustlineResponse = await fetch(`http://localhost:3000/api/trustline/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tontineWalletAddress: tontineWalletAddress,
                tontineSecret: tontineSecret
            })
        });
        const trustlineData = await trustlineResponse.json();
        if (!trustlineResponse.ok) {
            console.error("❌ Erreur lors de l'ajout de la Trustline :", trustlineData.error);
            return new Response(
                JSON.stringify({ error: '❌ Erreur lors de l’ajout de la Trustline.' }),
                { status: 500 }
            );
        }
        console.log(`✅ Trustline ajoutée: ${JSON.stringify(trustlineData, null, 2)}`);
        tontine.members.push(userId);
        await fs.writeFile(dataFilePath, JSON.stringify(tontines, null, 2), 'utf-8');

        return new Response(
            JSON.stringify({
                message: '✅ Successfully joined the tontine and trustline established',
                tontine: {
                    id: tontine.id,
                    tontineName: tontine.tontineName,
                    scheduledTime: tontine.scheduledTime,
                    members: tontine.members,
                },
                trustline: trustlineData
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('❌ Error in join API:', error);
        return new Response(
            JSON.stringify({ error: '❌ Internal server error' }),
            { status: 500 }
        );
    }
}
