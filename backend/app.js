const express = require('express');
const cors = require('cors');
const { createObjectCsvWriter } = require('csv-writer'); // Import csv-writer
const emailScraperRoutes = require('./routes/emailScraperRoutes');
const app = express();

app.use(cors());
app.use(express.json()); // Middleware for parsing JSON bodies

// Your email scraping routes
app.use('/api', emailScraperRoutes);

// CSV Download Route
app.get('/download-csv', async (req, res) => {
    // This array should contain the actual emails collected from your scraping process
    const emails = ["example1@gmail.com", "example2@gmail.com"]; // Replace with your actual email list

    // Create CSV Writer
    const csvWriter = createObjectCsvWriter({
        path: 'emails.csv',
        header: [
            { id: 'email', title: 'Email' },
        ],
    });

    // Write the emails to the CSV
    try {
        await csvWriter.writeRecords(emails.map(email => ({ email }))); // Convert to array of objects
        res.download('emails.csv', (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).send('Could not download the file');
            }
        });
    } catch (error) {
        console.error('CSV writing error:', error);
        res.status(500).send('Error creating CSV file');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
