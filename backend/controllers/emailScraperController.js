const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin()); // Use stealth plugin to avoid bot detection

// Helper function to introduce a random delay
const randomDelay = (min, max) => {
  return new Promise((resolve) => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, delay);
  });
};

// Controller function for scraping emails
exports.scrapeEmails = async (req, res) => {
  const { query } = req.body; // The user's dynamic search query
  const allEmails = new Set(); // Use a Set to avoid duplicate emails

  try {
      console.log("Launching browser...");

      const browser = await puppeteer.launch({
          headless: false, // Disable headless for debugging purposes
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();

      // Set a user-agent to mimic real browsers
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

      const keywords = query.split(' ').map(keyword => `"${keyword}"`).join(' '); // Wrap each word in double quotes

      for (let i = 0; i < 5; i++) { // Loop through multiple pages
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keywords + ' "gmail"')}&start=${i * 10}`;
          console.log(`Navigating to: ${searchUrl}`);

          // Go to Google search with a dynamic query
          await page.goto(searchUrl, {
              waitUntil: 'networkidle2',
              timeout: 60000, // Increase the timeout to 60 seconds
          });

          console.log('Page loaded successfully.');

          // Add a random delay to mimic human-like interaction
          await randomDelay(2000, 5000); // Random delay between 2 to 5 seconds

          // Extract emails from page content using a regex
          const emails = await page.evaluate(() => {
              const bodyText = document.body.innerText;
              const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g; // Regex for various email domains
              return bodyText.match(emailPattern) || []; // Match and return emails, or empty array if none found
          });

          // Add found emails to the Set
          emails.forEach(email => allEmails.add(email));
          console.log(`Found ${emails.length} emails on page ${i + 1}.`);

          // Random delay before the next search to avoid detection
          await randomDelay(2000, 5000); // Random delay between 2 to 5 seconds
      }

      await browser.close();

      const emailArray = Array.from(allEmails); // Convert Set back to Array

      if (emailArray.length > 0) {
          return res.status(200).json({ emails: emailArray.slice(0, 100) }); // Return the first 100 emails found
      } else {
          return res.status(404).json({ message: 'No emails found' });
      }
  } catch (error) {
      console.error('Scraping error:', error);
      return res.status(500).json({ message: 'Error occurred while scraping emails', error: error.message });
  }
};
