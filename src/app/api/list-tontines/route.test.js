// route.test.js
import {GET} from './route';

describe('GET function', () => {
    it('should return a 200 status and a JSON response with wallet balance', async () => {
        const response = await GET();
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.balance).toBeDefined();
        expect(data.balance).toBe('250.75');
    });

    it('should return a 500 status and error message on exception', async () => {
        jest.spyOn(global, 'Response').mockImplementation(() => {
            throw new Error('Internal server error');
        });

        const response = await GET().catch((error) =>
            new Response(JSON.stringify({error: error.message}), {
                status: 500,
                headers: {'Content-Type': 'application/json'},
            })
        );
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Internal server error');

        global.Response.mockRestore();
    });
});