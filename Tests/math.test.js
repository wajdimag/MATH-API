const request = require('supertest');
const app = require('../server'); // Stepping out of Tests/ to root where server.js lives

describe('Math API Endpoints', () => {
    
    // 1. Test the Addition endpoint successfully
    it('POST /add should return the sum of two numbers', async () => {
        const response = await request(app)
            .post('/add')                      // Changed to .post()
            .send({ a: 5, b: 10 });            // Sent via .send() using keys 'a' and 'b'
        
        expect(response.statusCode).toBe(200);
        expect(response.body.result).toBe(15);
    });

    // 2. Test the validation case (Missing inputs or wrong types)
    it('POST /add should fail if numbers are missing or invalid', async () => {
        const response = await request(app)
            .post('/add')
            .send({ a: "five", b: 10 });       // Passing a string to trigger the 400 error
        
        expect(response.statusCode).toBe(400); 
        expect(response.body.error).toBe("a and b must be numbers");
    });

    // 3. Test your GET Health Check route
    it('GET /health should return status UP', async () => {
        const response = await request(app).get('/health');
        
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("UP");
    });
});