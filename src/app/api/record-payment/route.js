import { sendRLUSD } from '@/lib/xrplClient';

/**
 * Handles HTTP requests by processing POST requests for RLUSD payments.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.method - The HTTP method of the request.
 * @param {Object} req.body - The body payload of the POST request.
 * @param {string} req.body.payer - The payer's identifier.
 * @param {string} req.body.secret - The secret or key of the payer.
 * @param {string} req.body.tontineMaster - The identifier of the tontine master.
 * @param {number} req.body.amount - The payment amount to be processed.
 * @param {string} req.body.issuer - The issuer of the payment transaction.
 * @param {Object} res - The HTTP response object.
 * @returns {void} Responds with a success message and transaction result for valid POST requests.
 * Responds with appropriate HTTP error status for invalid requests or errors during processing.
 */
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { payer, secret, tontineMaster, amount, issuer } = req.body;

        try {
            const response = await sendRLUSD(payer, secret, tontineMaster, amount, issuer);
            res.status(200).json({ message: 'Paiement enregistré avec succès', result: response });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
