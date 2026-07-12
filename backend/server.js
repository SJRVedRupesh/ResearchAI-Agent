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

/* ============================================
   CORS Configuration
============================================ */

const allowedOrigins = [
    "http://localhost:5173",
    "https://research-ai-agent-beta.vercel.app/"
];

app.use(
    cors({
        origin: function (origin, callback) {

            // Allow Postman, Swagger, curl, mobile apps
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error(`CORS blocked for origin: ${origin}`)
            );
        },

        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ],

        credentials: true
    })
);

/* ============================================
   Middlewares
============================================ */

app.use(express.json());

app.use(morgan("dev"));

/* ============================================
   API Routes
============================================ */

app.use("/api/v1/health", healthRoutes);

app.use("/api/v1/research", researchRoutes);

/* ============================================
   Root Route
============================================ */

app.get("/", (req, res) => {

    res.status(200).json({

        success: true,

        message: "🚀 AI Investment Research Agent Backend Running"

    });

});

/* ============================================
   Swagger
============================================ */

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

/* ============================================
   404 Route
============================================ */

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "API endpoint not found."

    });

});

/* ============================================
   Global Error Handler
============================================ */

app.use(errorHandler);

/* ============================================
   Start Server
============================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `🚀 Server is running on port ${PORT}`
    );

});