document.addEventListener("DOMContentLoaded", () => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    // Adjust timezone offset
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} | ${String(date.getHours()).padStart(
      2,
      "0"
    )}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`;
  };

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  // Convert to ISO string format and handle timezone
  const params = {
    startdate: firstDay.toISOString(),
    enddate: lastDay.toISOString(),
    type: ["Withdrawal"],
    take: 10,
    sort: "desc",
  };

  simlBC.getWalletTrxs(params, (err, data) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      return;
    }

    const pendingContainer = document.querySelector(
      ".withdrawal-history-wrapper.is-background-grid"
    );
    const historyContainer = document.querySelector(
      ".withdrawal-history-wrapper.is-background-grid.is-4-block"
    );

    pendingContainer.innerHTML = "";
    historyContainer.innerHTML = "";

    if (!data || !data.items) return;

    data.items.forEach((item) => {
      const container =
        item.displayType === "Withdrawal - Pending"
          ? pendingContainer
          : historyContainer;
      const accountNumber = item.description
        ? item.description.split(" ")[1]
        : "";

      const rowHtml = `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <div style="flex: 1;">${item.description.split(" ")[0]}</div>
            <div style="flex: 1;">${accountNumber}</div>
            <div style="flex: 1;">R${item.amount.toFixed(2)}</div>
            <div style="flex: 1;">${formatDate(item.transactionDate)}</div>
            ${
              item.displayType === "Withdrawal - Pending"
                ? `<div style="flex: 1; text-align: right;">
                <a sunbet-modals href="#" class="buttons is-small gradient-yellow w-button" sm-data="click" data-id="${item.id}">CANCEL</a>
              </div>`
                : ""
            }
          </div>`;

      container.innerHTML += rowHtml;
    });
  });

  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-id]")) {
      e.preventDefault();
      const transactionId = e.target.dataset.id;
      simlBC.cancelPendingWithdrawal(transactionId, (err, data) => {
        if (err) {
          console.error("Error canceling withdrawal:", err);
          return;
        }
        window.location.reload();
      });
    }
  });
});
