function initializeSlideOneValidation() {
  console.log("Initializing validation...");

  // Get all form fields
  const mobileInput = document.querySelector('input[name="telephone"]');
  const emailInput = document.querySelector('input[name="email"]');
  const form = document.querySelector('[sf-id="register_form"]');
  const nextButton = document.querySelector("#step-1");

  // Initialize mobile validation with numeric-only input
  if (mobileInput) {
    initializeMobileValidation(mobileInput);
  }

  // Add validation for mobile number
  if (mobileInput) {
    const formFieldWrapper = mobileInput.closest(".form-field-wrapper");
    let errorDiv = formFieldWrapper.querySelector("#telephoneError");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.id = "telephoneError";
      errorDiv.className = "text-danger text-size-small";
      errorDiv.innerHTML =
        '<p style="margin-top: 4px; margin-bottom: 0; color: #ff3366;"></p>';
      formFieldWrapper.appendChild(errorDiv);
    }

    mobileInput.addEventListener("input", function () {
      validateMobile(mobileInput, errorDiv);
    });

    mobileInput.addEventListener("blur", function () {
      validateMobile(mobileInput, errorDiv);
    });
  }

  // Add validation for email
  if (emailInput) {
    const formFieldWrapper = emailInput.closest(".form-field-wrapper");
    let errorDiv = formFieldWrapper.querySelector("#emailError");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.id = "emailError";
      errorDiv.className = "text-danger text-size-small";
      errorDiv.innerHTML =
        '<p style="margin-top: 4px; margin-bottom: 0; color: #ff3366;"></p>';
      formFieldWrapper.appendChild(errorDiv);
    }

    emailInput.addEventListener("input", function () {
      validateEmail(emailInput, errorDiv);
    });

    emailInput.addEventListener("blur", function () {
      validateEmail(emailInput, errorDiv);
    });
  }

  // Add validation before proceeding to next step
  if (nextButton) {
    nextButton.addEventListener("click", function (e) {
      const isMobileValid = validateMobile(
        mobileInput,
        mobileInput
          .closest(".form-field-wrapper")
          .querySelector("#telephoneError")
      );
      const isEmailValid = validateEmail(
        emailInput,
        emailInput.closest(".form-field-wrapper").querySelector("#emailError")
      );

      if (!isMobileValid || !isEmailValid) {
        e.preventDefault();
        return false;
      }
    });
  }

  // Add this to the mobile number validation
  function initializeMobileValidation(mobileInput) {
    if (!mobileInput) return;

    // Prevent non-numeric input
    mobileInput.addEventListener("input", function (e) {
      // Remove any non-numeric characters
      const value = this.value.replace(/[^0-9]/g, "");

      // Limit to 10 digits
      this.value = value.slice(0, 10);
    });

    // Add keypress event to prevent non-numeric input
    mobileInput.addEventListener("keypress", function (e) {
      // Allow only numbers (0-9)
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }

      // Prevent input if already at 10 digits
      if (
        this.value.length >= 10 &&
        e.key !== "Backspace" &&
        e.key !== "Delete"
      ) {
        e.preventDefault();
      }
    });

    // Prevent paste of non-numeric characters
    mobileInput.addEventListener("paste", function (e) {
      // Get pasted data
      let pastedData = (e.clipboardData || window.clipboardData).getData(
        "text"
      );

      // Check if pasted data contains non-numeric characters
      if (!/^\d*$/.test(pastedData)) {
        e.preventDefault();
      }
    });

    // Add the existing validation logic here
    const formFieldWrapper = mobileInput.closest(".form-field-wrapper");
    let errorDiv = formFieldWrapper.querySelector("#telephoneError");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.id = "telephoneError";
      errorDiv.className = "text-danger text-size-small";
      errorDiv.innerHTML =
        '<p style="margin-top: 4px; margin-bottom: 0; color: #ff3366;"></p>';
      formFieldWrapper.appendChild(errorDiv);
    }

    mobileInput.addEventListener("input", function () {
      validateMobile(mobileInput, errorDiv);
    });

    mobileInput.addEventListener("blur", function () {
      validateMobile(mobileInput, errorDiv);
    });
  }
}

function validateMobile(field, errorDiv) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = "";

  // Check if empty
  if (value.length === 0) {
    isValid = false;
    errorMessage = "Mobile number is required.";
  }
  // Check South African mobile format
  else {
    const cleanNumber = value.replace(/[^0-9]/g, "");
    if (cleanNumber.length !== 10) {
      isValid = false;
      errorMessage = "Mobile number must be 10 digits.";
    } else if (!cleanNumber.startsWith("0")) {
      isValid = false;
      errorMessage = "Mobile number must start with 0.";
    } else {
      const prefix = cleanNumber.substring(0, 2);
      const validPrefix = ["06", "07", "08"];
      if (!validPrefix.includes(prefix)) {
        isValid = false;
        errorMessage =
          "Invalid mobile number prefix. Must start with 06, 07, or 08.";
      }
    }
  }

  // Update UI
  if (!isValid) {
    field.style.borderColor = "#ff3366";
    errorDiv.style.display = "block";
    errorDiv.querySelector("p").textContent = errorMessage;
  } else {
    field.style.borderColor = "";
    errorDiv.style.display = "none";
    errorDiv.querySelector("p").textContent = "";
  }

  return isValid;
}

function validateEmail(field, errorDiv) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = "";

  // Check if empty
  if (value.length === 0) {
    isValid = false;
    errorMessage = "Email address is required.";
  }
  // Check email format
  else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = "Please enter a valid email address.";
    }
  }

  // Update UI
  if (!isValid) {
    field.style.borderColor = "#ff3366";
    errorDiv.style.display = "block";
    errorDiv.querySelector("p").textContent = errorMessage;
  } else {
    field.style.borderColor = "";
    errorDiv.style.display = "none";
    errorDiv.querySelector("p").textContent = "";
  }

  return isValid;
}

// Function to check if registration form is visible
function isRegistrationFormVisible() {
  const form = document.querySelector('[sf-id="register_form"]');
  return form && getComputedStyle(form).display !== "none";
}

// // Initialize form validation when modal becomes visible
// function checkForVisibleForm() {
//   console.log("Checking for visible form...");
//   if (isRegistrationFormVisible()) {
//     console.log("Registration form is now visible - initializing validation");
//     initializeRegistrationValidation();
//   }
// }

function initializeSlideValidations() {
  // Slide 1 Validations (already implemented)
  initializeSlideOneValidation();

  // Slide 2 Validations
  initializeSlideTwoValidation();

  // Slide 3 Validations
  initializeSlideThreeValidation();
}

function initializeSlideTwoValidation() {
  const firstNameInput = document.querySelector('input[name="firstname"]');
  const lastNameInput = document.querySelector('input[name="lastname"]');
  const daySelect = document.querySelector("#dd");
  const monthSelect = document.querySelector("#mm");
  const yearInput = document.querySelector("#yy");
  const idTypeSelect = document.querySelector("#idNumberType");
  const idNumberInput = document.querySelector("#idNumber");
  const nextButton = document.querySelector(
    '[sf-name="Slide 2"] [data-form="next-btn"]'
  );

  // Add maxLength attribute to idNumberInput
  idNumberInput.setAttribute("maxLength", "13");

  // Create shared error container for name fields
  const nameFieldWrapper = firstNameInput.closest(".form-field-wrapper");
  let nameErrorDiv = nameFieldWrapper.querySelector("#nameError");
  if (!nameErrorDiv) {
    nameErrorDiv = document.createElement("div");
    nameErrorDiv.id = "nameError";
    nameErrorDiv.className = "text-danger text-size-small";
    nameErrorDiv.innerHTML =
      '<p style="margin-top: 4px; margin-bottom: 0; color: #ff3366;"></p>';
    nameFieldWrapper.appendChild(nameErrorDiv);
  }

  // Create shared error container for DOB fields
  const dobFieldWrapper = daySelect.closest(".form-field-wrapper");
  let dobErrorDiv = dobFieldWrapper.querySelector("#dobError");
  if (!dobErrorDiv) {
    dobErrorDiv = document.createElement("div");
    dobErrorDiv.id = "dobError";
    dobErrorDiv.className = "text-danger text-size-small";
    dobErrorDiv.innerHTML =
      '<p style="margin-top: 4px; margin-bottom: 0; color: #ff3366;"></p>';
    dobFieldWrapper.appendChild(dobErrorDiv);
  }

  // Create shared error container for ID fields
  const idFieldWrapper = idTypeSelect.closest(".form-field-wrapper");
  let idErrorDiv = idFieldWrapper.querySelector("#idError");
  if (!idErrorDiv) {
    idErrorDiv = document.createElement("div");
    idErrorDiv.id = "idError";
    idErrorDiv.className = "text-danger text-size-small";
    idErrorDiv.innerHTML =
      '<p style="margin-top: 4px; margin-bottom: 0; color: #ff3366;"></p>';
    idFieldWrapper.appendChild(idErrorDiv);
  }

  // Modified validation for name fields
  const validateNames = () => {
    const firstNameResult = validateName(firstNameInput.value);
    const lastNameResult = validateName(lastNameInput.value);

    if (!firstNameResult.isValid || !lastNameResult.isValid) {
      firstNameInput.style.borderColor = !firstNameResult.isValid
        ? "#ff3366"
        : "";
      lastNameInput.style.borderColor = !lastNameResult.isValid
        ? "#ff3366"
        : "";
      nameErrorDiv.style.display = "block";
      nameErrorDiv.querySelector("p").textContent = !firstNameResult.isValid
        ? firstNameResult.message
        : lastNameResult.message;
      return false;
    } else {
      firstNameInput.style.borderColor = "";
      lastNameInput.style.borderColor = "";
      nameErrorDiv.style.display = "none";
      nameErrorDiv.querySelector("p").textContent = "";
      return true;
    }
  };

  // Modified validation for DOB fields
  const validateDOB = () => {
    const dayResult = validateDOBField(daySelect.value, "dd");
    const monthResult = validateDOBField(monthSelect.value, "mm");
    const yearResult = validateDOBField(yearInput.value, "yy");

    if (!dayResult.isValid || !monthResult.isValid || !yearResult.isValid) {
      daySelect.style.borderColor = !dayResult.isValid ? "#ff3366" : "";
      monthSelect.style.borderColor = !monthResult.isValid ? "#ff3366" : "";
      yearInput.style.borderColor = !yearResult.isValid ? "#ff3366" : "";
      dobErrorDiv.style.display = "block";
      dobErrorDiv.querySelector("p").textContent = !dayResult.isValid
        ? dayResult.message
        : !monthResult.isValid
        ? monthResult.message
        : yearResult.message;
      return false;
    } else {
      daySelect.style.borderColor = "";
      monthSelect.style.borderColor = "";
      yearInput.style.borderColor = "";
      dobErrorDiv.style.display = "none";
      dobErrorDiv.querySelector("p").textContent = "";
      return true;
    }
  };

  // Add event listeners for name fields
  firstNameInput?.addEventListener("input", validateNames);
  firstNameInput?.addEventListener("blur", validateNames);
  lastNameInput?.addEventListener("input", validateNames);
  lastNameInput?.addEventListener("blur", validateNames);

  // Add event listeners for DOB fields
  [daySelect, monthSelect, yearInput].forEach((field) => {
    field?.addEventListener("input", validateDOB);
    field?.addEventListener("blur", validateDOB);
  });

  // Add input event listener to enforce numeric input and exactly 13 digits
  idNumberInput?.addEventListener("input", (e) => {
    // Remove any non-numeric characters
    let value = e.target.value.replace(/[^\d]/g, "");

    // Truncate to 13 digits if longer
    if (value.length > 13) {
      value = value.slice(0, 13);
    }

    e.target.value = value;

    // Update validation state immediately
    validateID();
  });

  // Add validation for ID fields
  const validateID = () => {
    const idTypeValue = idTypeSelect.value;
    const idNumberValue = idNumberInput.value;
    const idNumberRegex = /^\d{13}$/; // Exactly 13 digits

    // Update placeholder based on selected ID type
    if (idTypeValue === "PSP") {
      idNumberInput.placeholder = "Passport Number";
    } else if (idTypeValue === "DNI") {
      idNumberInput.placeholder = "ID Number";
    } else {
      idNumberInput.placeholder = "ID Number";
    }

    if (!idTypeValue || !idNumberValue) {
      idTypeSelect.style.borderColor = !idTypeValue ? "#ff3366" : "";
      idNumberInput.style.borderColor = !idNumberValue ? "#ff3366" : "";
      idErrorDiv.style.display = "block";
      idErrorDiv.querySelector("p").textContent = !idTypeValue
        ? "Please select an ID Type"
        : `Please enter ${
            idTypeValue === "PSP" ? "a Passport Number" : "an ID Number"
          }`;
      return false;
    }

    // Always show error if not exactly 13 digits
    if (idNumberValue.length !== 13) {
      idNumberInput.style.borderColor = "#ff3366";
      idErrorDiv.style.display = "block";
      idErrorDiv.querySelector("p").textContent = `${
        idTypeValue === "PSP" ? "Passport Number" : "ID Number"
      } must be exactly 13 digits`;
      return false;
    }

    // Validate ID number format
    if (!idNumberRegex.test(idNumberValue)) {
      idNumberInput.style.borderColor = "#ff3366";
      idErrorDiv.style.display = "block";
      idErrorDiv.querySelector("p").textContent = `${
        idTypeValue === "PSP" ? "Passport Number" : "ID Number"
      } must be exactly 13 digits`;
      return false;
    }

    // If all validations pass
    idTypeSelect.style.borderColor = "";
    idNumberInput.style.borderColor = "";
    idErrorDiv.style.display = "none";
    idErrorDiv.querySelector("p").textContent = "";
    return true;
  };

  // Add event listeners for ID fields
  idTypeSelect?.addEventListener("change", validateID);
  idTypeSelect?.addEventListener("blur", validateID);
  idNumberInput?.addEventListener("input", validateID);
  idNumberInput?.addEventListener("blur", validateID);

  // Update next button state to include ID fields validation
  [
    firstNameInput,
    lastNameInput,
    daySelect,
    monthSelect,
    yearInput,
    idTypeSelect,
    idNumberInput,
  ].forEach((field) => {
    field?.addEventListener("input", () => updateNextButtonState(2));
  });

  // Update the updateNextButtonState function to check ID fields as well (if needed)
  const originalUpdateNextButtonState = window.updateNextButtonState;
  window.updateNextButtonState = (slideNumber) => {
    const slide = document.querySelector(`[sf-name="Slide ${slideNumber}"]`);
    const nextButton = slide.querySelector('[data-form="next-btn"]');
    if (!nextButton) return;

    const allValid = validateNames() && validateDOB() && validateID();

    nextButton.style.opacity = allValid ? "1" : "0.5";
    nextButton.style.pointerEvents = allValid ? "auto" : "none";
  };
}

function initializeSlideThreeValidation() {
  const usernameInput = document.querySelector('input[name="username"]');
  const passwordInput = document.querySelector('input[name="password"]');
  const submitButton = document.querySelector('[sf="submit"]');

  // Create error containers after each field wrapper
  const addErrorContainer = (input, fieldName) => {
    const formFieldWrapper = input.closest(".form-input-field");
    let errorDiv = document.querySelector(`#${fieldName}Error`);

    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.id = `${fieldName}Error`;
      errorDiv.className = "text-danger text-size-small";
      errorDiv.innerHTML =
        '<p style="margin-top: 4px; margin-bottom: 0; color: #ff3366;"></p>';
      // Insert after the form field wrapper
      formFieldWrapper.parentNode.insertBefore(
        errorDiv,
        formFieldWrapper.nextSibling
      );
    }
    return errorDiv;
  };

  const usernameErrorDiv = addErrorContainer(usernameInput, "username");
  const passwordErrorDiv = addErrorContainer(passwordInput, "password");

  const validateField = (input, errorDiv, validationFn) => {
    const result = validationFn(input.value);

    if (!result.isValid) {
      input.style.borderColor = "#ff3366";
      errorDiv.style.display = "block";
      errorDiv.querySelector("p").textContent = result.message;
      return false;
    } else {
      input.style.borderColor = "";
      errorDiv.style.display = "none";
      errorDiv.querySelector("p").textContent = "";
      return true;
    }
  };

  // Add event listeners for inline validation
  usernameInput?.addEventListener("input", () =>
    validateField(usernameInput, usernameErrorDiv, validateUsername)
  );
  usernameInput?.addEventListener("blur", () =>
    validateField(usernameInput, usernameErrorDiv, validateUsername)
  );

  passwordInput?.addEventListener("input", () =>
    validateField(passwordInput, passwordErrorDiv, validatePassword)
  );
  passwordInput?.addEventListener("blur", () =>
    validateField(passwordInput, passwordErrorDiv, validatePassword)
  );

  // Update submit button state
  const validateAllFields = () => {
    const isUsernameValid = validateField(
      usernameInput,
      usernameErrorDiv,
      validateUsername
    );
    const isPasswordValid = validateField(
      passwordInput,
      passwordErrorDiv,
      validatePassword
    );
    return isUsernameValid && isPasswordValid;
  };

  // Update submit button state whenever any field changes
  [usernameInput, passwordInput].forEach((input) => {
    input?.addEventListener("input", () => {
      validateField(
        input,
        input.nextElementSibling,
        input.name === "username" ? validateUsername : validatePassword
      );
    });
  });
}

function updateSubmitButtonState(form) {
  const submitButton = form.querySelector('[sf="submit"]');
  const allInputs = form.querySelectorAll("input[required]");

  const allValid = Array.from(allInputs).every((input) => {
    const value = input.value.trim();
    return value && !input.hasAttribute("data-invalid");
  });

  if (submitButton) {
    submitButton.disabled = !allValid;
    submitButton.style.opacity = allValid ? "1" : "0.5";
    submitButton.style.pointerEvents = allValid ? "auto" : "none";
  }
}

function validateUsername(value) {
  if (!value) return { isValid: false, message: "Username is required" };
  if (value.length < 4) {
    return {
      isValid: false,
      message: "Username must be at least 4 characters",
    };
  }
  if (value.length > 35) {
    return {
      isValid: false,
      message: "Username cannot exceed 35 characters",
    };
  }
  // Allow letters, numbers, underscores, and hyphens
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    return {
      isValid: false,
      message:
        "Username can only contain letters, numbers, underscores and hyphens",
    };
  }
  // Username must start with a letter
  if (!/^[A-Za-z]/.test(value)) {
    return {
      isValid: false,
      message: "Username must start with a letter",
    };
  }
  return { isValid: true, message: "" };
}

function validatePassword(value) {
  if (!value) return { isValid: false, message: "Password is required" };

  if (value.length < 8 || value.length > 14) {
    return {
      isValid: false,
      message: "Password must be 8-14 characters long",
    };
  }

  // Check for alphanumeric requirement
  if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(value)) {
    return {
      isValid: false,
      message: "Password must contain both letters and numbers",
    };
  }

  // Check for uppercase
  if (!/[A-Z]/.test(value)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  // Check for lowercase
  if (!/[a-z]/.test(value)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  // Check for numbers
  if (!/\d/.test(value)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  // Check for special characters
  if (!/[!@#$%^&*]/.test(value)) {
    return {
      isValid: false,
      message:
        "Password must contain at least one special character (!@#$%^&*)",
    };
  }

  return { isValid: true, message: "" };
}

function validateDOBField(value, fieldName) {
  if (!value) return { isValid: false, message: "Required" };

  // Get all DOB fields
  const day = document.querySelector("#dd")?.value;
  const month = document.querySelector("#mm")?.value;
  const year = document.querySelector("#yy")?.value;

  // Only validate complete date if all fields are filled
  if (day && month && year) {
    const date = new Date(year, month - 1, day);

    // Check if it's a valid date
    if (
      date.getDate() != day ||
      date.getMonth() + 1 != month ||
      date.getFullYear() != year
    ) {
      return { isValid: false, message: "Invalid date" };
    }

    // Check if user is at least 18 years old
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (
      age < 18 ||
      (age === 18 && monthDiff < 0) ||
      (age === 18 && monthDiff === 0 && today.getDate() < date.getDate())
    ) {
      return { isValid: false, message: "Must be 18 or older" };
    }
  }

  return { isValid: true, message: "" };
}

// Helper function to add validation to a field
function addFieldValidation(field, fieldName, validationFunction) {
  if (!field) return;

  const formFieldWrapper = field.closest(".form-field-wrapper");
  let errorDiv = formFieldWrapper.querySelector(`#${fieldName}Error`);

  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.id = `${fieldName}Error`;
    errorDiv.className = "text-danger text-size-small";
    errorDiv.innerHTML =
      '<p style="margin-top: 4px; margin-bottom: 0; color: #ff3366;"></p>';
    formFieldWrapper.appendChild(errorDiv);
  }

  const validateField = () => {
    const result = validationFunction(field.value, fieldName);
    if (!result.isValid) {
      field.style.borderColor = "#ff3366";
      errorDiv.style.display = "block";
      errorDiv.querySelector("p").textContent = result.message;
    } else {
      field.style.borderColor = "";
      errorDiv.style.display = "none";
      errorDiv.querySelector("p").textContent = "";
    }
    updateSubmitButtonState(field.closest("form"));
    return result.isValid;
  };

  field.addEventListener("input", validateField);
  field.addEventListener("blur", validateField);

  return validateField;
}

// Function to update next button state for a specific slide
function updateNextButtonState(slideNumber) {
  const slide = document.querySelector(`[sf-name="Slide ${slideNumber}"]`);
  const nextButton = slide.querySelector('[data-form="next-btn"]');
  if (!nextButton) return;

  const fields = slide.querySelectorAll("input[required], select[required]");
  const allValid = Array.from(fields).every((field) => {
    const errorDiv = field
      .closest(".form-field-wrapper")
      .querySelector(
        `#${field.getAttribute("name")}Error, #${field.getAttribute("id")}Error`
      );
    return !errorDiv || errorDiv.style.display === "none";
  });

  nextButton.style.opacity = allValid ? "1" : "0.5";
  nextButton.style.pointerEvents = allValid ? "auto" : "none";
}

// Function to update submit button state
function updateSubmitButtonState() {
  const submitButton = document.querySelector('[sf="submit"]');
  if (!submitButton) return;

  const slide = document.querySelector('[sf-name="Slide 3"]');
  const fields = slide.querySelectorAll("input[required]");
  const allValid = Array.from(fields).every((field) => {
    const errorDiv = field
      .closest(".form-field-wrapper")
      .querySelector(`#${field.getAttribute("name")}Error`);
    return !errorDiv || errorDiv.style.display === "none";
  });

  submitButton.style.opacity = allValid ? "1" : "0.5";
  submitButton.style.pointerEvents = allValid ? "auto" : "none";
}

// Update the checkForVisibleForm function to initialize all slides
function checkForVisibleForm() {
  console.log("Checking for visible form...");
  if (isRegistrationFormVisible()) {
    console.log(
      "Registration form is now visible - initializing all validations"
    );
    initializeSlideValidations();
  }
}

// Watch for clicks on register button
// document.addEventListener("click", function (e) {
//   if (e.target.closest('[sunbet-modals="register"]')) {
//     console.log("Register button clicked");
//     // Give the modal time to open
//     setTimeout(checkForVisibleForm, 100);
//   }
// });

// Also check when DOM is loaded in case form is already visible
document.addEventListener("DOMContentLoaded", checkForVisibleForm);

//Username
// Modify the event listener for slide changes
document.addEventListener("click", function (e) {
  // Check if we're moving to slide 3 (username/password slide)
  if (e.target.closest('[data-form="next-btn"]')) {
    setTimeout(() => {
      const usernameInput = document.querySelector("#username");
      console.log("Found username input:", usernameInput);

      if (usernameInput) {
        // First, try to find existing error div
        let formFieldWrapper = usernameInput.closest(".form-field-wrapper");
        let errorDiv = document.querySelector("#usernameError");

        // If error div doesn't exist, create it
        if (!errorDiv) {
          errorDiv = document.createElement("div");
          errorDiv.id = "usernameError";
          errorDiv.className = "text-danger text-size-small";
          errorDiv.innerHTML =
            '<p style="margin-top: 4px; margin-bottom: 0; color: #ff3366;"></p>';

          // Insert error div after the input field
          usernameInput.parentNode.insertBefore(
            errorDiv,
            usernameInput.nextSibling
          );
        }

        // Remove any existing event listeners
        const newUsernameInput = usernameInput.cloneNode(true);
        usernameInput.parentNode.replaceChild(newUsernameInput, usernameInput);

        // Add fresh event listeners
        newUsernameInput.addEventListener("input", function () {
          validateUsernameField(this, errorDiv);
        });

        newUsernameInput.addEventListener("blur", function () {
          validateUsernameField(this, errorDiv);
        });
      }
    }, 200); // Increased delay slightly
  }
});

function validateUsernameField(field, errorDiv) {
  console.log("Validating username field");
  const value = field.value.trim();

  if (!value) {
    field.style.borderColor = "#ff3366";
    errorDiv.style.display = "block";
    errorDiv.querySelector("p").textContent = "Please fill in this field.";
  } else {
    field.style.borderColor = "";
    errorDiv.style.display = "none";
    errorDiv.querySelector("p").textContent = "";
  }
}

//login

function initializeLoginValidation() {
  const loginForm = document.querySelector('[data-name="login_form"]');

  if (!loginForm) {
    console.log("Login form not found");
    return;
  }

  const usernameInput = loginForm.querySelector('input[name="username"]');
  const passwordInput = loginForm.querySelector('input[name="password"]');
  const submitButton = loginForm.querySelector('input[type="submit"]');

  // Add validation for username
  if (usernameInput) {
    const formFieldWrapper = usernameInput.closest(".is-position-relative");
    let errorDiv = formFieldWrapper.querySelector("#loginUsernameError");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.id = "loginUsernameError";
      errorDiv.className = "text-danger text-size-small";

      errorDiv.innerHTML =
        '<p style="margin-top: 4px; margin-bottom: 0; color: #ff3366;"></p>';
      errorDiv.style.cssText = `
        position: absolute;
        bottom: -28px;
        left: 4px;
        z-index: 1;
      `;
      formFieldWrapper.style.position = "relative";
      formFieldWrapper.style.marginBottom = "16px";

      formFieldWrapper.appendChild(errorDiv);
    }

    usernameInput.addEventListener("input", function () {
      validateLoginField(this, errorDiv);
    });

    usernameInput.addEventListener("blur", function () {
      validateLoginField(this, errorDiv);
    });
  }

  // Add validation for password
  if (passwordInput) {
    const formFieldWrapper = passwordInput.closest(".is-position-relative");
    let errorDiv = document.createElement("div");
    errorDiv.id = "loginPasswordError";
    errorDiv.className = "text-danger text-size-small";
    errorDiv.style.cssText = `
      position: absolute;
      bottom: -30px;
      left: 4px;
      z-index: 1;
  `;
    errorDiv.innerHTML =
      '<p style="margin-top: 4px; margin-bottom: 0; color: #ff3366;"></p>';

    // Ensure the wrapper has relative positioning
    formFieldWrapper.style.position = "relative";
    formFieldWrapper.style.marginBottom = "25px"; // Add space for error message

    // Add error div after the input field wrapper
    formFieldWrapper.appendChild(errorDiv);

    // Add validation listeners
    passwordInput.addEventListener("input", function () {
      validateLoginField(this, errorDiv);
    });

    passwordInput.addEventListener("blur", function () {
      validateLoginField(this, errorDiv);
    });
  }

  // Add form submit validation
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      const isUsernameValid = validateLoginField(
        usernameInput,
        document.querySelector("#loginUsernameError")
      );
      const isPasswordValid = validateLoginField(
        passwordInput,
        document.querySelector("#loginPasswordError")
      );

      if (!isUsernameValid || !isPasswordValid) {
        e.preventDefault();
        return false;
      }
    });
  }

  // Update submit button state on input
  function updateSubmitButtonState() {
    if (!submitButton) return;

    const isUsernameValid = usernameInput && usernameInput.value.trim() !== "";
    const isPasswordValid = passwordInput && passwordInput.value.trim() !== "";

    submitButton.style.opacity =
      isUsernameValid && isPasswordValid ? "1" : "0.5";
    submitButton.style.pointerEvents =
      isUsernameValid && isPasswordValid ? "auto" : "none";
  }

  // Add input listeners to update button state
  if (usernameInput) {
    usernameInput.addEventListener("input", updateSubmitButtonState);
  }
  if (passwordInput) {
    passwordInput.addEventListener("input", updateSubmitButtonState);
  }

  // Initial button state
  updateSubmitButtonState();
}

function validateLoginField(field, errorDiv) {
  if (!field || !errorDiv) return false;

  const value = field.value.trim();
  let isValid = true;
  let errorMessage = "";

  if (!value) {
    isValid = false;
    errorMessage = "Please fill in this field.";
  }

  if (!isValid) {
    field.style.borderColor = "#ff3366";
    errorDiv.style.display = "block";
    errorDiv.querySelector("p").textContent = errorMessage;
  } else {
    field.style.borderColor = "";
    errorDiv.style.display = "none";
    errorDiv.querySelector("p").textContent = "";
  }

  return isValid;
}

// // Watch for login modal opening
// document.addEventListener("click", function (e) {
//   if (e.target.closest('[sunbet-modals="login"]')) {
//     console.log("Login button clicked");
//     setTimeout(() => {
//       initializeLoginValidation();
//     }, 100);
//   }
// });

function initializePasswordToggle() {
  const loginForm = document.querySelector('[data-name="login_form"]');
  if (!loginForm) return;

  const passwordField = loginForm.querySelector('input[name="password"]');
  const lockIcon = loginForm.querySelector(".password-toggle-icon");

  if (!passwordField || !lockIcon) return;

  // Add click event to toggle password visibility
  let isPasswordVisible = false;
  lockIcon.style.cursor = "pointer"; // Make icon clickable

  lockIcon.addEventListener("click", function () {
    isPasswordVisible = !isPasswordVisible;

    // Toggle password field type
    passwordField.type = isPasswordVisible ? "text" : "password";

    // Toggle icon visibility
    const eyeIcon = this.querySelector(".eye-icon");
    const eyeSlashIcon = this.querySelector(".eye-slash-icon");

    if (isPasswordVisible) {
      eyeIcon.style.display = "none";
      eyeSlashIcon.style.display = "block";
    } else {
      eyeIcon.style.display = "block";
      eyeSlashIcon.style.display = "none";
    }
  });
}

// Add to your existing login form initialization
// document.addEventListener("click", function (e) {
//   if (e.target.closest('[sunbet-modals="login"]')) {
//     console.log("Login button clicked");
//     setTimeout(() => {
//       initializeLoginValidation();
//       initializePasswordToggle(); // Add password toggle initialization
//     }, 100);
//   }
// });

// Initialize when DOM loads in case modal is already open
document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector('[data-name="login_form"]')) {
    initializeLoginValidation();
    initializePasswordToggle(); // Add password toggle initialization
  }
});

// Observer for login form
const loginObserver = new MutationObserver((mutations) => {
  const loginForm = document.querySelector('[data-name="login_form"]');
  if (loginForm) {
    loginObserver.disconnect();
    initializeLoginValidation();
    initializePasswordToggle();
  }
});

// Observer for registration form
const registerObserver = new MutationObserver((mutations) => {
  const registerForm = document.querySelector('[sf-id="register_form"]');
  if (registerForm) {
    registerObserver.disconnect();
    initializeSlideValidations();
  }
});

// Start observing only when login/register buttons are clicked
document.addEventListener("click", (e) => {
  if (e.target.closest('[sunbet-modals="login"]')) {
    loginObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  if (e.target.closest('[sunbet-modals="register"]')) {
    registerObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Create a MutationObserver to watch for the deposit modal being added
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          // Check if the added node is the deposit modal
          if (node.matches && node.matches("[sunbet-depisit-modal]")) {
            initializeDepositValidation();
          }
        });
      }
    });
  });

  // Start observing the body for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  function initializeDepositValidation() {
    const depositInputs = document.querySelectorAll(
      'input[name="deposit_amount"]'
    );
    const minimumAmount = 50;

    depositInputs.forEach((depositInput) => {
      // Create error message element if it doesn't exist
      let errorDiv = depositInput.parentElement.querySelector(
        ".deposit-error-message"
      );
      if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.className = "deposit-error-message";
        errorDiv.style.color = "#ff3b30";
        errorDiv.style.fontSize = "12px";
        errorDiv.style.marginTop = "4px";
        errorDiv.style.display = "none";
        errorDiv.textContent = `Minimum deposit amount is R${minimumAmount}`;
        depositInput.parentElement.appendChild(errorDiv);
      }

      // Validate on input change
      depositInput.addEventListener("input", (e) => {
        const value = parseFloat(e.target.value);
        validateAmount(value, depositInput, errorDiv);
      });

      // Validate on form submission
      const form = depositInput.closest("form");
      if (form) {
        form.addEventListener("submit", (e) => {
          const value = parseFloat(depositInput.value);
          if (!validateAmount(value, depositInput, errorDiv)) {
            e.preventDefault();
          }
        });
      }

      // Set initial attributes
      depositInput.setAttribute("min", minimumAmount);
      depositInput.setAttribute("data-min", minimumAmount);
    });
  }

  function validateAmount(value, input, errorElement) {
    const minimumAmount = 50;
    const isValid = value >= minimumAmount;

    if (!isValid) {
      errorElement.style.display = "block";
      input.style.borderColor = "#ff3b30";
      return false;
    } else {
      errorElement.style.display = "none";
      input.style.borderColor = "";
      return true;
    }
  }
});
