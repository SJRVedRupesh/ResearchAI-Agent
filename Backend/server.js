const express = require("express");
const cors = require("cors");
// Import routes
const healthRoutes = require("./routes/healthRoutes");
const researchRoutes = require("./routes/researchRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// Register routes
app.use("/health", healthRoutes);
app.use("/api/research", researchRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("Research AI Agent Backend Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});