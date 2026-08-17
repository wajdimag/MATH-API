const express = require('express');

const app = express();

app.disable('x-powered-by'); // Hide the X-Powered-By: Express (sonarqube)

const mathRoutes = require('./Routes/MathRoutes');

app.use(express.json());

app.use('/', mathRoutes);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
module.exports = app;
