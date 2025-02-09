import fs from "fs";
import path from "path";

/**
 * The variable `tontinesFile` represents the absolute file path to the JSON file
 * named "tontines.json" located within the "data" directory of the current
 * working directory. This file is used to store or retrieve information
 * relevant to tontines.
 *
 * The path is dynamically constructed using the `process.cwd()` method to
 * ensure it adapts to the current runtime directory, making it suitable for
 * various deployment environments.
 */
const tontinesFile = path.join(process.cwd(), "data", "tontines.json");

/**
 * Handles a GET request to retrieve tontine information for a specific user.
 *
 * @param {Request} request - The incoming HTTP request object containing the URL and query parameters.
 * @return {Promise<Response>} A promise that resolves to an HTTP Response object.
 * The response contains:
 * - status 200 and a JSON body with a list of tontines associated with the user if successful.
 * - status 400 and a JSON body with an error message if the `userId` parameter is missing.
 * - status 500 and a JSON body with an error message in case of an internal server error.
 */
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return new Response(
            JSON.stringify({ error: "User ID is required." }),
            { status: 400, headers: { "Content-Type": "application/json" } },
        );
    }

    try {
        const tontinesData = fs.readFileSync(tontinesFile, "utf8");
        const tontines = JSON.parse(tontinesData);

        const userTontines = tontines.filter((tontine) =>
            tontine.members.includes(userId)
        ).map((tontine) => ({
            id: tontine.id,
            tontineName: tontine.tontineName,
            scheduledTime: tontine.scheduledTime,
            status: tontine.status,
        }));
        console.log(`✅ ${userTontines.length} tontines found for user: ${userId}`);
        return new Response(
            JSON.stringify({ tontines: userTontines }),
            { status: 200, headers: { "Content-Type": "application/json" } },
        );
    } catch (error) {
        console.error("❌ Error fetching tontines:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
}
