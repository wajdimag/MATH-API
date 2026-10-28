// Mock auth middleware 
jest.mock('../auth', () => (req, res, next) => next());
const request = require('supertest');
const app = require('../server');

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

        it('should fail if inputs are not numbers or missing', async () => {
            const res = await request(app).post('/add').send({ a: "five", b: 10 });
            expect(res.statusCode).toBe(400);
        });

        it('should fail if b parameter is missing', async () => {
            const res = await request(app).post('/add').send({ a: 5 });
            expect(res.statusCode).toBe(400);
        });
    });

    // ==========================================
    // 2. SUBTRACTION
    // ==========================================
    describe('POST /subtract', () => {
        it('should return the difference of two numbers', async () => {
            const res = await request(app).post('/subtract').send({ a: 20, b: 8 });
            expect(res.statusCode).toBe(200);
            expect(res.body.result).toBe(12);
        });

        it('should fail if inputs are missing or invalid', async () => {
            const res = await request(app).post('/subtract').send({ a: 20 });
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
        });

        it('should fail if inputs are missing', async () => {
            const res = await request(app).post('/divide').send({ a: 10 });
            expect(res.statusCode).toBe(400);
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
        });

        it('should fail if parameter a is missing or not a number', async () => {
            const res = await request(app).post('/sqrt').send({});
            expect(res.statusCode).toBe(400);
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
        });
    });

    // ==========================================
    // 9. HEALTH & ROUTING COVERAGE
    // ==========================================
    describe('GET /health & Root Routes', () => {
        it('should return service health status UP', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("UP");
        });

        it('should handle root endpoint GET / if defined', async () => {
            const res = await request(app).get('/');
            expect([200, 404]).toContain(res.statusCode);
        });

        it('should return 404 for non-existent routes', async () => {
            const res = await request(app).get('/non-existent-endpoint');
            expect(res.statusCode).toBe(404);
        });
    });

});
// ==========================================
    // 10. BRANCH & ERROR COVERAGE (SonarQube Boost)
    // ==========================================
    describe('Edge Cases for 85%+ Coverage', () => {
        it('should hit missing parameter branch in /subtract', async () => {
            const res = await request(app).post('/subtract').send({});
            expect(res.statusCode).toBe(400);
        });

        it('should hit missing parameter branch in /power', async () => {
            const res = await request(app).post('/power').send({});
            expect(res.statusCode).toBe(400);
        });


        it('should hit express error handler in server.js', async () => {
            const res = await request(app)
                .post('/add')
                .set('Content-Type', 'application/json')
                .send('{"invalid_json": ');
            expect(res.statusCode).toBe(400);
        });
    });
