import { sendRLUSD } from '@/lib/xrplClient';

/**
 * Handles incoming HTTP requests for processing a transaction.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.method - The HTTP method of the request.
 * @param {Object} req.body - The body of the HTTP request containing necessary transaction details.
 * @param {string} req.body.account - The account initiating the transaction.
 * @param {string} req.body.secret - The secret key of the initiating account.
 * @param {string} req.body.destination - The destination account for the transaction.
 * @param {number} req.body.amount - The amount to be sent in the transaction.
 * @param {string} req.body.issuer - The issuer associated with the transaction.
 * @param {Object} res - The HTTP response object to send data back to the client.
 * @return {Promise<void>} Resolves when the response has been sent to the client.
 */
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { account, secret, destination, amount, issuer } = req.body;
        try {
            const response = await sendRLUSD(account, secret, destination, amount, issuer);
            res.status(200).json({ result: response });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
