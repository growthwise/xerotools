// Use on the Client Insights page to extract the client name and bank reconciliation status for all visible rows and download as a CSV

// Select all table rows
const rows = document.querySelectorAll('tr.xui-readonlytablerow');

// Prepare CSV content
let csvContent = 'Client Name,Bank Reconciliation Status\n';

// Loop through each row
rows.forEach(row => {
  // Extract Client Name from first column
  const clientNameElement = row.querySelector('td:first-child span.practiceinsights-clientorganisation-ui-InsightsTableColumns--name-column');
  const clientName = clientNameElement ? clientNameElement.textContent.trim() : '';

  // Extract Bank Reconciliation Status from second column
  const statusElement = row.querySelector('td:nth-child(2) button span.xui-tag span.xui-tagcontent');
  const status = statusElement ? statusElement.textContent.trim() : '';

  // Append to CSV if both are present
  if (clientName && status) {
    csvContent += `"${clientName.replace(/"/g, '""')}","${status.replace(/"/g, '""')}"\n`;
  }
});

// Create a Blob with the CSV content
const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

// Create a download link
const link = document.createElement('a');
const url = URL.createObjectURL(blob);
link.setAttribute('href', url);
link.setAttribute('download', 'client_bank_status.csv');
link.style.visibility = 'hidden';
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
