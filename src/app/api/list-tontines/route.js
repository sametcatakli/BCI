/**
 * Handles the GET request to fetch a list of tontines.
 * Tontines include information such as their ID, name, and cycle size.
 * If an error occurs, it returns a JSON response with an error message and a status code of 500.
 *
 * @return {Response} A JSON response containing an array of tontines or an error message.
 */
export async function GET() {
    try {
        const tontines = [
            { id: 'xrpl_001', name: 'Tontine Entrepreneurs', cycleSize: 30 },
            { id: 'rlsud_002', name: 'Tontine Investisseurs', cycleSize: 15 },
        ];

        return Response.json({ tontines });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
