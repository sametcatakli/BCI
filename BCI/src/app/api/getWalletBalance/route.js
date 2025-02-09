import { getRLUSDBalance } from '@/utils/xrplService';

/**
 * Handles a POST request to retrieve the balance of a specified wallet address.
 *
 * @param {Request} request The incoming POST request containing wallet address in the JSON body.
 * @return {Promise<Response>} A Promise that resolves to a Response object containing the wallet balance or an error message.
 */
export async function POST(request) {
    try {
        const { walletAddress } = await request.json();
        if (!walletAddress) {
            return new Response(
                JSON.stringify({ error: 'Adresse de wallet requise' }),
                { status: 400 }
            );
        }
        const balance = await getRLUSDBalance(walletAddress);
        return new Response(
            JSON.stringify({ balance }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Erreur dans getWalletBalance:', error);
        return new Response(
            JSON.stringify({ error: 'Erreur lors de la récupération du solde' }),
            { status: 500 }
        );
    }
}
