// Server Entry Point
require('dotenv').config();
const app = require('./app.cjs');

const PORT = process.env.PORT || 5000;

// Only listen if not in a serverless environment (like Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;

