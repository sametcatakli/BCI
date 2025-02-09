import fs from 'fs';
import path from 'path';

/**
 * Represents the file path to the tontines JSON file located in the data directory.
 * This variable constructs the path dynamically based on the current working directory of the process.
 * It is used to access and manage tontines data stored in a JSON file.
 *
 * @type {string}
 */
const tontinesFile = path.join(process.cwd(), 'data', 'tontines.json');

/**
 * Handles GET requests to fetch details about a specific tontine.
 *
 * @param {Request} request - The incoming HTTP request object containing the URL with search parameters.
 * @return {Promise<Response>} A promise that resolves to an HTTP Response object with the tontine details
 * or an error message depending on the request validity and data availability.
 */
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const tontineId = searchParams.get('id');

    if (!tontineId) {
        return new Response(
            JSON.stringify({ error: 'Tontine ID is required.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const tontines = JSON.parse(fs.readFileSync(tontinesFile, 'utf8'));
        const tontine = tontines.find((t) => t.id === tontineId);

        if (!tontine) {
            return new Response(
                JSON.stringify({ error: 'Tontine not found.' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify(tontine),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error fetching tontine details:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
