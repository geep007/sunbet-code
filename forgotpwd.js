// // Keep track of opened modals
// const originalSunbetModalsRender = window.sunbetModalsRender;
// window.sunbetModalsRender = async function (modalName) {
//   console.log("Modal rendering:", modalName);

//   // Call the original render function first
//   const result = await originalSunbetModalsRender(modalName);

//   // After modal is rendered, attach our listeners if it's the forgot password modal
//   if (modalName === "forgot-password") {
//     setTimeout(() => {
//       console.log("Setting up forgot password handlers");
//       setupForgotPasswordHandlers();
//     }, 1000); // Increased timeout to ensure modal is fully rendered
//   }

//   return result;
// };

// function setupForgotPasswordHandlers() {
//   // Find elements
//   const submitButton = document.querySelector(".buttons");
//   const usernameInput = document.querySelector('input[type="text"]');
//   const smsCheckbox = document.querySelector('input[value="SMS"]');
//   const emailCheckbox = document.querySelector('input[value="EMAIL"]');

//   console.log("Elements found:", {
//     submitButton: !!submitButton,
//     usernameInput: !!usernameInput,
//     smsCheckbox: !!smsCheckbox,
//     emailCheckbox: !!emailCheckbox,
//   });

//   // Reset button state
//   if (submitButton) {
//     submitButton.textContent = "SUBMIT";

//     submitButton.addEventListener("click", function (e) {
//       e.preventDefault();
//       e.stopPropagation(); // Prevent event bubbling

//       console.log("Submit clicked with values:", {
//         username: usernameInput?.value,
//         sms: smsCheckbox?.checked,
//         email: emailCheckbox?.checked,
//       });

//       // Reset button state if validation fails
//       if (!usernameInput?.value) {
//         submitButton.textContent = "SUBMIT";
//         console.log("No username entered");
//         return;
//       }

//       if (!smsCheckbox?.checked && !emailCheckbox?.checked) {
//         submitButton.textContent = "SUBMIT";
//         console.log("No delivery method selected");
//         return;
//       }

//       // If we get here, form is valid
//       submitButton.textContent = "PLEASE WAIT...";
//     });
//   }
// }

// document.addEventListener("DOMContentLoaded", () => {
//   console.log("Testing forgot password API with real username...");

//   const username = "testgeet";

//   // Test forgotPassword method
//   console.log(`Testing forgotPassword method for username: ${username}`);
//   simlBC.forgotPassword(username, (err, data) => {
//     console.log("forgotPassword Response:", {
//       error: err,
//       data: data,
//       errorDetails: err?.errors?.[0],
//     });

//     // If successful, log next steps available
//     if (data) {
//       console.log("Success! Next available steps:", {
//         resetForgotPassword: !!simlBC.resetForgotPassword,
//         checkResetForgotPasswordToken: !!simlBC.checkResetForgotPasswordToken,
//       });
//     }
//   });
// });

// document.addEventListener("DOMContentLoaded", () => {
//   // First let's inspect what we get from a successful forgotPassword call
//   const username = "testgeet";

//   console.log("Starting password reset flow for:", username);
//   simlBC.forgotPassword(username, (err, data) => {
//     console.log("Initial forgotPassword response:", {
//       error: err,
//       data: data,
//       errorDetails: err?.errors?.[0],
//     });
//   });
// });

// document.addEventListener("DOMContentLoaded", () => {
//   console.log("Testing forgot password API with real username...");

//   const username = "testgeet";

//   // Test forgotPassword method
//   console.log(`Testing forgotPassword method for username: ${username}`);
//   simlBC.forgotPassword(username, (err, data) => {
//     console.log("forgotPassword Response:", {
//       error: err,
//       data: data,
//       errorDetails: err?.errors?.[0],
//     });

//     // If successful, log next steps available
//     if (data) {
//       console.log("Success! Next available steps:", {
//         resetForgotPassword: !!simlBC.resetForgotPassword,
//         checkResetForgotPasswordToken: !!simlBC.checkResetForgotPasswordToken,
//       });
//     }
//   });
// });

//Latest

// Initialize forgot password functionality
function initializeForgotPassword() {
  // Wait for modal to be fully rendered
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        const modal = document.querySelector(
          ".login-form-content-wrapper.is-forgot"
        );
        if (modal) {
          console.log("Forgot password modal detected");
          setupForgotPasswordForm(modal);
          observer.disconnect();
        }
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function setupForgotPasswordForm(modalElement) {
  // Get form elements
  const form = modalElement.querySelector("#wf-form-login_form");
  const usernameInput = modalElement.querySelector("#loginEnterUsername");
  const submitButton = modalElement.querySelector("#passwordRecoveryBtn");
  const errorMessage = modalElement.querySelector(".w-form-fail");
  const successMessage = modalElement.querySelector(".w-form-done");

  // Get checkboxes
  const smsCheckbox = modalElement.querySelector(
    'input[type="checkbox"]:first-of-type'
  );
  const emailCheckbox = modalElement.querySelector(
    'input[type="checkbox"]:last-of-type'
  );

  if (!form || !usernameInput || !submitButton) {
    console.error("Required form elements not found");
    return;
  }

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Reset messages
    if (errorMessage) errorMessage.style.display = "none";
    if (successMessage) successMessage.style.display = "none";

    const username = usernameInput.value.trim();

    // Validation
    if (!username) {
      if (errorMessage) {
        errorMessage.querySelector("div").textContent =
          "Please enter your username";
        errorMessage.style.display = "block";
      }
      return;
    }

    // Check if at least one delivery method is selected
    if (!smsCheckbox.checked && !emailCheckbox.checked) {
      if (errorMessage) {
        errorMessage.querySelector("div").textContent =
          "Please select at least one delivery method";
        errorMessage.style.display = "block";
      }
      return;
    }

    // Disable button and show loading state
    const originalButtonText = submitButton.value;
    submitButton.disabled = true;
    submitButton.value = "Processing...";

    // Call forgot password API
    simlBC.forgotPassword(username, (err, data) => {
      submitButton.disabled = false;
      submitButton.value = originalButtonText;

      if (err) {
        console.error("Password reset error:", err);
        if (errorMessage) {
          const errorDetail =
            err.errors?.[0]?.detail || "An error occurred. Please try again.";
          errorMessage.querySelector("div").textContent = errorDetail;
          errorMessage.style.display = "block";
        }
        return;
      }

      if (data?.success) {
        if (successMessage) {
          successMessage.querySelector("div").textContent =
            "Password reset instructions have been sent to your selected delivery method(s).";
          successMessage.style.display = "block";
        }

        // Clear form
        usernameInput.value = "";
        smsCheckbox.checked = false;
        emailCheckbox.checked = false;

        // Close modal after delay
        setTimeout(() => {
          const closeButton = modalElement.querySelector('[sm-data="closer"]');
          if (closeButton) closeButton.click();
        }, 3000);
      }
    });
  });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initializeForgotPassword);

//username

// Initialize forgot username functionality
document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        const modal = document.querySelector(".single-form-block.is-forgot");
        if (modal && modal.querySelector("#loginEnterEmail")) {
          console.log("Forgot username modal detected");
          setupForgotUsernameForm(modal);
          observer.disconnect();
        }
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

function setupForgotUsernameForm(modalElement) {
  const form = modalElement.querySelector("#wf-form-login_form");
  const emailInput = modalElement.querySelector("#loginEnterEmail");
  const submitButton = modalElement.querySelector("#usernameRecoveryBtn");

  if (!form || !emailInput || !submitButton) {
    console.error("Required form elements not found:", {
      form: !!form,
      emailInput: !!emailInput,
      submitButton: !!submitButton,
    });
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    console.log("Email submitted:", email);

    // Show loading state
    const originalButtonText = submitButton.value;
    submitButton.disabled = true;
    submitButton.value =
      submitButton.getAttribute("data-wait") || "Please wait...";

    // Call forgot username API
    simlBC.forgotUsername(email, (err, data) => {
      console.log("Forgot Username API Response:", {
        error: err,
        data: data,
        email: email,
      });

      // Reset button state
      submitButton.disabled = false;
      submitButton.value = originalButtonText;

      if (err) {
        console.log("Error response:", {
          status: err.errors?.[0]?.status,
          detail: err.errors?.[0]?.detail,
        });
        return;
      }

      if (data?.success) {
        console.log("Username recovery request successful for email:", email);
      }
    });
  });
}
