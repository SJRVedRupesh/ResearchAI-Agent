require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./docs/swagger");

const healthRoutes = require("./routes/healthRoutes");
const researchRoutes = require("./routes/researchRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/research", researchRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("🚀 AI Investment Research Agent Backend Running");
});

// Swagger
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});