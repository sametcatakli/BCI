import { Tontine } from '@/lib/tontine';
/**
 * Handles POST requests to add a new member to a tontine.
 *
 * @param {Request} req - The HTTP request object, which contains the data for the tontine, user, and amount in the JSON body.
 * @return {Promise<Response>} A Promise resolving to an HTTP response object containing a success message and tontine details on success,
 *                             or an error message with status 500 on failure.
 */
export async function POST(req) {
    const { tontineId, userId, amount } = await req.json();
    try {
        const tontine = new Tontine();
        tontine.addMember(userId, amount);
        return Response.json({ message: 'Membre ajouté avec succès', tontine });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
