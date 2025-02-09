/**
 * Handles a GET request to retrieve the wallet balance.
 *
 * @return {Promise<Response>} A Response object containing a JSON payload.
 * If successful, the payload includes the wallet balance under the 'balance' key with a status code of 200.
 * In case of an error, the response contains an error message under the 'error' key with a status code of 500.
 */
export async function GET() {
    try {
        const walletBalance = '250.75';

        return new Response(
            JSON.stringify({ balance: walletBalance }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
