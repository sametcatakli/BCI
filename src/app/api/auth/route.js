import fs from 'fs';
import path from 'path';
/**
 * The `usersFile` variable represents the file path to the JSON file
 * that contains user data. It is constructed as an absolute path
 * by joining the current working directory with the relative directories
 * 'data' and the file name 'users.json'.
 *
 * This path is typically used to read from or write to the users' data file.
 */
const usersFile = path.join(process.cwd(), 'data', 'users.json');
/**
 * Handles POST requests to authenticate or retrieve user session information.
 * This method checks if the user's wallet address exists. If it does not exist,
 * it creates a new user with a unique user ID and session token.
 *
 * @param {Request} req The HTTP request object containing the JSON body with the wallet address.
 * @return {Response} A response object containing user data (userId, walletAddress, sessionToken)
 * in JSON format with a 200 status code if successful. If the wallet address is missing, returns a
 * 400 status code with an error message. In the case of an internal server error, returns a
 * 500 status code with an error message.
 */
export async function POST(req) {
    try {
        const { walletAddress } = await req.json();
        if (!walletAddress) {
            return new Response(JSON.stringify({ error: 'Adresse de wallet manquante.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        let users = [];
        if (fs.existsSync(usersFile)) {
            const data = fs.readFileSync(usersFile, 'utf8');
            users = JSON.parse(data);
        }
        let user = users.find((u) => u.walletAddress === walletAddress);
        if (!user) {
            user = {
                userId: `user_${Date.now()}`,
                walletAddress,
                sessionToken: `session_${Math.random().toString(36).substring(2)}`,
            };
            users.push(user);
            fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
        }
        return new Response(
            JSON.stringify({
                userId: user.userId,
                walletAddress: user.walletAddress,
                sessionToken: user.sessionToken,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Erreur API Auth:', error);
        return new Response(
            JSON.stringify({ error: 'Erreur interne du serveur.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
