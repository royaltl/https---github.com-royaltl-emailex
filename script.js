document.getElementById('searchButton').addEventListener('click', fetchEmails);
document.getElementById('clearButton').addEventListener('click', clearEmails);
document.getElementById('downloadButton').addEventListener('click', downloadCSV);

async function fetchEmails() {
    const query = document.getElementById('searchInput').value;
    const loadingIndicator = document.getElementById('loading');
    const emailsContainer = document.getElementById('emailsContainer');
    emailsContainer.innerHTML = ''; // Clear previous emails
    loadingIndicator.classList.remove('hidden');

    try {
        const response = await fetch('http://localhost:3000/api/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });

        if (response.ok) {
            const data = await response.json();
            const emails = data.emails || [];
            if (emails.length > 0) {
                emailsContainer.innerHTML = emails.join('<br/>');
            } else {
                emailsContainer.innerHTML = 'No emails found';
            }
        } else {
            emailsContainer.innerHTML = `Error: ${response.statusText}`;
        }
    } catch (error) {
        emailsContainer.innerHTML = `Error fetching emails: ${error.message}`;
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

function clearEmails() {
    document.getElementById('emailsContainer').innerHTML = '';
    document.getElementById('searchInput').value = '';
}

function downloadCSV() {
    const emails = document.getElementById('emailsContainer').innerText.split('\n').join(',');
    const url = `http://localhost:3000/download-csv?emails=${encodeURIComponent(emails)}`;
    window.open(url, '_blank');
}
