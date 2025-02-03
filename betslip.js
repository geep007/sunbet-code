function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function updateBetslips(betslips) {
  // Get the container
  const container = document.querySelector(
    ".withdrawal-history-wrapper.is-betslip"
  );

  // Get the first row (non-header) as template
  const templateRow = document.querySelector(
    ".withdrawal-info-row-grid.is-betslip:not(.is-heading)"
  );

  // Remove any existing data rows
  const existingRows = document.querySelectorAll(
    ".withdrawal-info-row-grid.is-betslip:not(.is-heading)"
  );
  existingRows.forEach((row, index) => {
    if (index > 0) {
      // Keep the first row as template
      row.remove();
    }
  });

  // Update and/or create rows for each betslip
  betslips.forEach((betslip, index) => {
    let row;
    if (index === 0) {
      // Use the existing first row
      row = templateRow;
    } else {
      // Clone the template for additional rows
      row = templateRow.cloneNode(true);
      container.appendChild(row);
    }

    // Update row content
    const dateTime = row.querySelector('[id*="date-time"]');
    const provider = row.querySelector('[id*="provider"]');
    const game = row.querySelector('[id*="game"]');
    const stake = row.querySelector('[id*="stake"]');
    const win = row.querySelector('[id*="win"]');
    const betslipLink = row.querySelector('[id*="betslip"]');

    if (dateTime) dateTime.textContent = formatDate(betslip.transactionDate);
    if (provider)
      provider.textContent = betslip.details.providerName || "Unknown";
    if (game) game.textContent = betslip.description || "N/A";
    if (stake) stake.textContent = betslip.amount || "0";
    if (win) win.textContent = "0";

    if (betslipLink) {
      betslipLink.textContent = "VIEW";
      betslipLink.setAttribute("data-betslip-id", betslip.id);
      betslipLink.setAttribute("data-remote-id", betslip.remoteReference);
    }
  });

  // Add click handlers to all VIEW links
  document.querySelectorAll(".is-betslip-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const betslipId = e.target.getAttribute("data-betslip-id");
      const remoteId = e.target.getAttribute("data-remote-id");
      console.log("View betslip:", betslipId, remoteId);
    });
  });
}

function loadBetslips(startDate, endDate) {
  // Convert dates to ISO string format
  const start = startDate ? new Date(startDate) : new Date();
  const end = endDate ? new Date(endDate) : new Date();

  // Set time to start of day for start date and end of day for end date
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const queryOptions = {
    startdate: start.toISOString(),
    enddate: end.toISOString(),
    sort: "desc",
    type: ["Stake", "Debit", "Win"],
    take: 10,
  };

  simlBC.getWalletTrxs(queryOptions, (err, data) => {
    if (err) {
      console.error("Error fetching betslips:", err);
      return;
    }

    if (data && data.items) {
      console.log(`Displaying ${data.items.length} betslips`);
      updateBetslips(data.items);
    }
  });
}
// Initialize date pickers and handle changes
// Initialize date pickers and handle changes
document.addEventListener("DOMContentLoaded", () => {
  let fromDate = "";
  let toDate = "";

  // Get both date picker inputs
  const fromDateInput = document.querySelector("#Date");
  const toDateInput = document.querySelector("#Date-2");

  // Initialize datepickers with event handling
  $(fromDateInput).datepicker({
    format: "mm-dd-yyyy",
    pick: function (e) {
      fromDate = $(this).datepicker("getDate");
      console.log("From Date selected:", fromDate);

      if (fromDate && toDate) {
        loadBetslips(fromDate, toDate);
      }
    },
  });

  $(toDateInput).datepicker({
    format: "mm-dd-yyyy",
    pick: function (e) {
      toDate = $(this).datepicker("getDate");
      console.log("To Date selected:", toDate);

      if (fromDate && toDate) {
        loadBetslips(fromDate, toDate);
      }
    },
  });
});
