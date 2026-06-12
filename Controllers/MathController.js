exports.add = (req, res) => {
    const { a, b } = req.body;

if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({
        error: "a and b must be numbers"
    });
}

    res.json({
        result: a + b
    });
};
exports.substract = (req, res) => {
    const { a, b } = req.body;

    if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({
        error: "a and b must be numbers"
    });
}

    res.json({
        result: a - b
    });
};
exports.multiply = (req, res) => {
    const { a, b } = req.body;

    if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({
        error: "a and b must be numbers"
    });
}

    res.json({
        result: a * b
    });
};
exports.divide = (req, res) => {
    const { a, b } = req.body;

    if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({
        error: "a and b must be numbers"
    });
}

    if (b === 0) {
        return res.status(400).json({
            error: "Division by zero is not allowed."
        });
    }

    res.json({
        result: a / b
    });
};

exports.power = (req, res) => {
    const { a, b } = req.body;

    if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({
        error: "a and b must be numbers"
    });
}

    res.json({
        result: a ** b
    });
};

exports.sqrt = (req, res) => {
    const { a } = req.body;

    if (typeof a !== "number" ) {
    return res.status(400).json({
        error: "a and b must be numbers"
    });
}

    // Validation: Check if the number is negative
    if (a < 0) {
        return res.status(400).json({
            error: "Cannot calculate the square root of a negative number."
        });
    }

    res.json({
        result: Math.sqrt(a)
    });
};

exports.average = (req, res) => {
    const { numbers } = req.body; // Expecting an array, e.g., [10, 20, 30]


    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
        return res.status(400).json({
            error: "Please provide an array of numbers named 'numbers'."
        });
    }

    const total = numbers.reduce((sum, num) => sum + num, 0);
    const avg = total / numbers.length;

    res.json({ result: avg });
};

exports.percentage = (req, res) => {
    const { percent, total } = req.body; 

    if (percent === undefined || total === undefined) {
        return res.status(400).json({
            error: "Please provide both 'percent' and 'total' in the request body."
        });
    }

    const result = (percent / 100) * total;

    res.json({ result: result });
};

exports.healthCheck = (req, res) => {
    res.json({
        status: "UP",
        timestamp: new Date().toISOString(),
        message: "Math API is running smoothly"
    });
};