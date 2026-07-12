const express = require("express");

const router = express.Router();

const {
    analyzeCompany
} = require("../controllers/researchController");

/**
 * @swagger
 * /api/v1/research:
 *   post:
 *     summary: Generate AI investment research report
 *     tags:
 *       - Research
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *
 *               company:
 *                 type: string
 *                 example: NVIDIA
 *
 *     responses:
 *
 *       200:
 *         description: Investment report generated successfully
 *
 *       400:
 *         description: Invalid request
 *
 *       500:
 *         description: Internal Server Error
 */

router.post("/", analyzeCompany);

module.exports = router;