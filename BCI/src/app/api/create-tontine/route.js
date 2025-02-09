import fs from 'fs/promises';
import path from 'path';

/**
 * Represents the file path to the 'tontines.json' data file.
 * The path is constructed dynamically based on the current working directory,
 * ensuring it adapts to the runtime environment.
 * This variable is used to locate and access data related to tontines.
 */
const dataFilePath = path.join(process.cwd(), 'data', 'tontines.json');

/**
 * Handles the creation of a new Tontine group by validating input data,
 * checking for duplicate names, and storing the new Tontine in a data file.
 *
 * @param {Request} req - The HTTP request object containing JSON data with required fields: `name`, `cycleSize`, `password`, and `creatorId`.
 * @return {Promise<Response>} A promise that resolves to a Response object. Success returns the created Tontine data with a 201 status code. Errors return an error message with appropriate status codes (400 for bad input, 500 for server errors).
 */
export async function POST(req) {
    try {
        const { name, cycleSize, password, creatorId } = await req.json();
        if (!name || !cycleSize || !password || !creatorId) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400 }
            );
        }
        try {
            await fs.access(dataFilePath);
        } catch (err) {
            await fs.writeFile(dataFilePath, JSON.stringify([]), 'utf-8');
        }
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const tontines = JSON.parse(data);

        const tontineId = `rlsud_${name}_${Math.random().toString(36).substring(2, 7)}`;

        if (tontines.some((t) => t.name === name)) {
            return new Response(
                JSON.stringify({ error: 'Tontine with the same name already exists' }),
                { status: 400 }
            );
        }
        const newTontine = {
            id: tontineId,
            name,
            cycleSize: parseInt(cycleSize, 10),
            password,
            members: [creatorId],
            createdAt: new Date().toISOString(),
        };
        tontines.push(newTontine);
        await fs.writeFile(dataFilePath, JSON.stringify(tontines, null, 2), 'utf-8');
        return new Response(JSON.stringify({ tontine: newTontine }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error creating tontine:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500 }
        );
    }
}
