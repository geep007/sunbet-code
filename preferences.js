//Prefrences

// Function to update checkbox state with Webflow styling
function updateCheckboxState(checkboxId, value) {
  var checkbox = document.getElementById(checkboxId);
  if (!checkbox) {
    console.log("Checkbox not found:", checkboxId);
    return;
  }

  // Get the custom checkbox div
  var customCheckbox =
    checkbox.parentElement.querySelector(".w-checkbox-input");
  if (!customCheckbox) {
    console.log("Custom checkbox not found");
    return;
  }

  // Update the actual input
  checkbox.checked = Boolean(value);

  // Update custom checkbox styling
  if (value) {
    customCheckbox.classList.add("w--redirected-checked");
  } else {
    customCheckbox.classList.remove("w--redirected-checked");
  }
}

// Function to populate preferences from API
function populatePreferences() {
  simlBC.getProfile(function (err, data) {
    if (err) {
      console.log("Error fetching profile:", err);
      return;
    }

    // Safely access marketing preferences
    var marketing = data?.player?.profile?.marketing;
    if (!marketing) {
      console.log("No marketing preferences found");
      return;
    }

    // Update checkboxes with the correct property names
    updateCheckboxState("EMAIL", marketing.marketingOptInEmail);
    updateCheckboxState("SMS", marketing.marketingOptInSms);
    updateCheckboxState("TELEPHONE", marketing.marketingOptInTelephone);
  });

  simlBC.getAccountData((err, data) => {
    if (err) return;

    // Extract preferences using regex
    const sportsMatch = data.match(/sports_preferences":"([^"]+)"/);
    const eventsMatch = data.match(/events_preferences":"([^"]+)"/);

    const sportDropdown = document.getElementById("Fav-Sport");
    const eventDropdown = document.getElementById("Event");

    if (sportsMatch && sportsMatch[1] && sportDropdown) {
      console.log("Sports preference:", sportsMatch[1]);
      sportDropdown.value = sportsMatch[1];
    }

    if (eventsMatch && eventsMatch[1] && eventDropdown) {
      console.log("Events preference:", eventsMatch[1]);
      eventDropdown.value = eventsMatch[1];
    }
  });
}

function setupUpdateButton() {
  // Find checkboxes
  const emailCheckbox = document.getElementById("EMAIL");
  const smsCheckbox = document.getElementById("SMS");
  const telephoneCheckbox = document.getElementById("TELEPHONE");
  // Add event listeners for dropdowns
  const sportDropdown = document.getElementById("Fav-Sport");
  const eventDropdown = document.getElementById("Event");

  // Add change listeners to checkboxes
  if (emailCheckbox) {
    emailCheckbox.addEventListener("change", function () {
      console.log("Email checkbox changed to:", this.checked);
    });
  }

  if (smsCheckbox) {
    smsCheckbox.addEventListener("change", function () {
      console.log("SMS checkbox changed to:", this.checked);
    });
  }

  if (telephoneCheckbox) {
    telephoneCheckbox.addEventListener("change", function () {
      console.log("Telephone checkbox changed to:", this.checked);
    });
  }

  // Find update button
  var updateButton = Array.from(
    document.querySelectorAll(".gradient-yellow.w-button")
  ).find((button) =>
    button.textContent.toLowerCase().includes("update preferences")
  );

  if (!updateButton) {
    console.log("Update button not found");
    return;
  }

  updateButton.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Update button clicked");

    // Store checkbox states
    const preferences = {
      email: emailCheckbox ? emailCheckbox.checked : false,
      sms: smsCheckbox ? smsCheckbox.checked : false,
      telephone: telephoneCheckbox ? telephoneCheckbox.checked : false,
    };

    // Store sports preferences
    const sportsData = {
      sports_preferences: sportDropdown ? sportDropdown.value : "None",
      events_preferences: eventDropdown ? eventDropdown.value : "None",
    };

    // Request PIN
    simlBC.requestSessionPin(300, "email", function (requestErr, requestData) {
      if (requestErr) {
        console.log("PIN request failed:", requestErr);
        return;
      }

      console.log("PIN requested successfully");
      sunbetModalsRender("otp-verification-modal");

      const otpHandler = function (event) {
        const submittedOTP = event.detail.otp;
        const messageHandlers = event.detail.messageHandlers;

        simlBC.verifySessionPin(
          300,
          submittedOTP,
          function (verifyErr, verifyData) {
            if (verifyErr) {
              console.log("PIN verification failed:", verifyErr);
              if (messageHandlers?.showError) {
                messageHandlers.showError("PIN verification failed");
              }
              return;
            }

            if (messageHandlers?.showSuccess) {
              messageHandlers.showSuccess("PIN verified successfully");
            }

            // Update both marketing and sports preferences
            setTimeout(() => {
              // Update marketing preferences
              const marketingUpdate = {
                marketing: {
                  email: preferences.email,
                  sms: preferences.sms,
                  telephone: preferences.telephone,
                  post: true,
                  push: true,
                },
              };

              // First update marketing preferences
              simlBC.updateProfile(marketingUpdate, (err, response) => {
                if (err) {
                  console.error("Marketing update failed:", err);
                  return;
                }

                // Then update sports preferences
                simlBC.updateAccountData(
                  sportsData,
                  (sportsErr, sportsResponse) => {
                    if (sportsErr) {
                      console.error(
                        "Sports preferences update failed:",
                        sportsErr
                      );
                      document.querySelector(".w-form-fail").style.display =
                        "block";
                    } else {
                      console.log("All updates successful");
                      document.querySelector(".w-form-done").style.display =
                        "block";
                    }

                    // Hide status message after 3 seconds
                    setTimeout(() => {
                      document.querySelector(".w-form-done").style.display =
                        "none";
                      document.querySelector(".w-form-fail").style.display =
                        "none";
                    }, 3000);
                  }
                );
              });
            }, 1500);
          }
        );

        window.removeEventListener("otp-submitted", otpHandler);
      };

      window.addEventListener("otp-submitted", otpHandler);
    });
  });
}

// function updateSportsPreferences() {
//   const sportDropdown = document.getElementById("Fav-Sport");
//   const eventDropdown = document.getElementById("Event");

//   const updatePreferences = () => {
//     const payload = {
//       sports_preferences: sportDropdown.value,
//       events_preferences: eventDropdown.value,
//     };

//     simlBC.requestSessionPin(300, "email", function (requestErr) {
//       if (requestErr) return;

//       sunbetModalsRender("otp-verification-modal");

//       const otpHandler = function (event) {
//         const submittedOTP = event.detail.otp;

//         simlBC.verifySessionPin(300, submittedOTP, function (verifyErr) {
//           if (verifyErr) return;

//           fetch(
//             "https://weapistg.sunbet.co.za/pub/int/SIMLBede/updateaccountdata",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify(payload),
//             }
//           ).then((response) => {
//             const element = response.ok ? ".w-form-done" : ".w-form-fail";
//             document.querySelector(element).style.display = "block";
//             setTimeout(() => {
//               document.querySelector(element).style.display = "none";
//             }, 3000);
//           });
//         });

//         window.removeEventListener("otp-submitted", otpHandler);
//       };

//       window.addEventListener("otp-submitted", otpHandler);
//     });
//   };

//   sportDropdown?.addEventListener("change", updatePreferences);
//   eventDropdown?.addEventListener("change", updatePreferences);
// }

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  console.log("Initializing preferences...");
  populatePreferences();
  setupUpdateButton();
  //updateSportsPreferences();
});
