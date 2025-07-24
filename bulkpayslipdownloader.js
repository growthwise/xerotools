// Go to the payslips page for any employee before running this in the console it will download all payslips so you dont have to click each one
// For video instructions see https://www.youtube.com/watch?v=4tlJ0uQdaIE


// Set the maximum number of files to download
const MAX_DOWNLOADS = 10; // Change this to whatever limit you want (e.g., 50, 100)

// Function to extract CID from current URL
function extractCIDFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const cid = urlParams.get('CID');
    
    if (!cid) {
        // If CID is not in the query parameters, try to find it in the URL path or hash
        const match = window.location.href.match(/CID=([^&]+)/);
        return match ? match[1] : '';
    }
    
    return cid;
}

// Get the current CID
const currentCID = extractCIDFromURL();
console.log(`Current CID parameter: ${currentCID}`);

if (!currentCID) {
    console.error('Could not find CID parameter in the current URL. Script may not work correctly.');
}

// Find all download buttons and limit to MAX_DOWNLOADS
const downloadButtons = Array.from(document.querySelectorAll('i.fa.fa-download')).slice(0, MAX_DOWNLOADS);
console.log(`Found ${downloadButtons.length} files to download (limited to ${MAX_DOWNLOADS})`);

// Function to get the period from the same row
function getPeriodFromButton(button) {
    const row = button.closest('tr');
    const periodCell = row.querySelector('td[data-column="0"]');
    return periodCell ? periodCell.textContent.trim() : `Unknown_Period_${Date.now()}`;
}

// Function to get the payslip ID from the row's id attribute
function getPayslipIdFromRow(row) {
    const rowId = row.id; // e.g., "tr_cmp-grida74ee646-8e27-4539-81d3-3b9969bf75fa"
    const prefix = "tr_cmp-grid";
    if (rowId && rowId.startsWith(prefix)) {
        return rowId.replace(prefix, ""); // Extract the ID part
    }
    return null;
}

// Function to download with a custom filename
function downloadFile(url, filename) {
    fetch(url, { credentials: 'include' }) // Include cookies for authentication
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.blob();
        })
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            console.log(`Downloaded: ${filename}`);
        })
        .catch(error => console.error(`Failed to download ${filename}:`, error));
}

// Process each button up to the limit
downloadButtons.forEach((button, index) => {
    const period = getPeriodFromButton(button);
    const filename = period.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf';
    const row = button.closest('tr');
    const payslipId = getPayslipIdFromRow(row);
    
    if (!payslipId) {
        console.error(`No payslip ID found for button ${index}, skipping...`);
        return;
    }
    
    // Use the dynamic CID value
    const url = `https://payroll.xero.com/xpa/payslips/${payslipId}?format=pdf&CID=${currentCID}`;
    
    setTimeout(() => {
        console.log(`Downloading ${index + 1} of ${downloadButtons.length} - Filename: ${filename}, URL: ${url}`);
        downloadFile(url, filename);
    }, index * 1000); // 1-second delay between downloads
});
