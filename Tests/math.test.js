const request = require('supertest');
const app = require('../server'); // Path to your server.js

describe('Math API Comprehensive Endpoints Suite', () => {
    
    // ==========================================
    // 1. ADDITION
    // ==========================================
    describe('POST /add', () => {
        it('should return the sum of two numbers', async () => {
            const res = await request(app).post('/add').send({ a: 5, b: 10 });
            expect(res.statusCode).toBe(200);
            expect(res.body.result).toBe(15);
        });

        it('should fail if inputs are not numbers', async () => {
            const res = await request(app).post('/add').send({ a: "five", b: 10 });
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe("a and b must be numbers");
        });
    });

    // ==========================================
    // 2. SUBTRACTION
    // ==========================================
    describe('POST /subtract', () => { // Fixed spelling here
        it('should return the difference of two numbers', async () => {
            const res = await request(app).post('/subtract').send({ a: 20, b: 8 }); // Fixed spelling here
            expect(res.statusCode).toBe(200);
            expect(res.body.result).toBe(12);
        });

        it('should fail if inputs are missing or invalid', async () => {
            const res = await request(app).post('/subtract').send({ a: 20 }); // Fixed spelling here
            expect(res.statusCode).toBe(400);
        });
    });

    // ==========================================
    // 3. MULTIPLICATION
    // ==========================================
    describe('POST /multiply', () => {
        it('should return the product of two numbers', async () => {
            const res = await request(app).post('/multiply').send({ a: 4, b: 5 });
            expect(res.statusCode).toBe(200);
            expect(res.body.result).toBe(20);
        });

        it('should fail if inputs are invalid', async () => {
            const res = await request(app).post('/multiply').send({ a: 4, b: "xyz" });
            expect(res.statusCode).toBe(400);
        });
    });

    // ==========================================
    // 4. DIVISION
    // ==========================================
    describe('POST /divide', () => {
        it('should divide two numbers correctly', async () => {
            const res = await request(app).post('/divide').send({ a: 20, b: 4 });
            expect(res.statusCode).toBe(200);
            expect(res.body.result).toBe(5);
        });

        it('should return 400 when attempting division by zero', async () => {
            const res = await request(app).post('/divide').send({ a: 10, b: 0 });
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe("Division by zero is not allowed.");
        });
    });

    // ==========================================
    // 5. POWER (EXPONENT)
    // ==========================================
    describe('POST /power', () => {
        it('should raise a to the power of b', async () => {
            const res = await request(app).post('/power').send({ a: 2, b: 3 });
            expect(res.statusCode).toBe(200);
            expect(res.body.result).toBe(8);
        });

        it('should fail if inputs are invalid', async () => {
            const res = await request(app).post('/power').send({ a: null, b: 3 });
            expect(res.statusCode).toBe(400);
        });
    });

    // ==========================================
    // 6. SQUARE ROOT
    // ==========================================
    describe('POST /sqrt', () => {
        it('should calculate the square root of a positive number', async () => {
            const res = await request(app).post('/sqrt').send({ a: 9 });
            expect(res.statusCode).toBe(200);
            expect(res.body.result).toBe(3);
        });

        it('should return 400 for negative numbers', async () => {
            const res = await request(app).post('/sqrt').send({ a: -9 });
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe("Cannot calculate the square root of a negative number.");
        });
    });

    // ==========================================
    // 7. AVERAGE
    // ==========================================
    describe('POST /avg', () => {
        it('should calculate the average of an array of numbers', async () => {
            const res = await request(app).post('/avg').send({ numbers: [10, 20, 30, 40] });
            expect(res.statusCode).toBe(200);
            expect(res.body.result).toBe(25);
        });

        it('should fail if payload is not an array or is empty', async () => {
            const res = await request(app).post('/avg').send({ numbers: "not-an-array" });
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe("Please provide an array of numbers named 'numbers'.");
        });
    });

    // ==========================================
    // 8. PERCENTAGE
    // ==========================================
    describe('POST /percentage', () => {
        it('should calculate percentage of a total correctly', async () => {
            const res = await request(app).post('/percentage').send({ percent: 20, total: 150 });
            expect(res.statusCode).toBe(200);
            expect(res.body.result).toBe(30);
        });

        it('should fail if percent or total parameters are missing', async () => {
            const res = await request(app).post('/percentage').send({ percent: 20 });
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe("Please provide both 'percent' and 'total' in the request body.");
        });
    });

    // ==========================================
    // 9. HEALTH CHECK
    // ==========================================
    describe('GET /health', () => {
        it('should return service health status UP', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("UP");
            expect(res.body).toHaveProperty('timestamp');
        });
    });
});