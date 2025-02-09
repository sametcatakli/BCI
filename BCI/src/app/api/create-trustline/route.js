// src/app/api/create-trustline/route.js
import { createTrustLine } from '@/lib/xrplClient';

/**
 * Handles the POST request to create a trust line with given parameters.
 *
 * @param {Request} req - The HTTP request object containing the JSON body
 * with the required fields: account, secret, issuer, currency, and limit.
 * @return {Promise<Response>} - Returns a Response object containing
 * either the result of the trust line creation or an error message
 * with a 500 status code in case of failure.
 */
export async function POST(req) {
    const { account, secret, issuer, currency, limit } = await req.json();

    try {
        const response = await createTrustLine(account, secret, issuer, currency, limit);
        return Response.json({ result: response });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
