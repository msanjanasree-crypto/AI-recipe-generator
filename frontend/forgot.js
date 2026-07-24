(function () {
  const form = document.getElementById("forgotForm");
  const emailInput = document.getElementById("email");
  const field = emailInput.closest(".field");
  const errorMsg = document.getElementById("errorMsg");
  const submitBtn = document.getElementById("submitBtn");
  const successBox = document.getElementById("successBox");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.add("show");
    field.classList.add("invalid");
  }
  function clearError() {
    errorMsg.textContent = "";
    errorMsg.classList.remove("show");
    field.classList.remove("invalid");
  }
  emailInput.addEventListener("input", clearError);
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const value = emailInput.value.trim();
    if (!value) return showError("Please enter your email.");
    if (!EMAIL_RE.test(value)) return showError("Enter a valid email address.");
    clearError();
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;
    // Simulated request
    setTimeout(function () {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
      form.hidden = true;
      form.reset();
      successBox.hidden = false;
    }, 1500);
  });
})();
