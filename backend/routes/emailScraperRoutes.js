const express = require('express');
const router = express.Router();
const { scrapeEmails } = require('../controllers/emailScraperController');

// POST route for scraping emails
router.post('/scrape', scrapeEmails);

module.exports = router;
