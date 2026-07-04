const express = require("express");

const router = express.Router();

const {
    analyzeCompany
} = require("../controllers/researchController");

router.post("/", analyzeCompany);

module.exports = router;