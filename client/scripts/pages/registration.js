import { UsersAPI, setCurrentUserId } from "../api/fetch_api.js";

export function initRegistrationPage() {
  const registrationForm = document.querySelector(".registration-box");
  
  if (!registrationForm) return;

  registrationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(registrationForm);
    const email = formData.get("email");
    const displayName = formData.get("displayName");
    const password = formData.get("password");

    if (!email || !displayName || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const user = await UsersAPI.signup(email, displayName);
      
      // Store the user ID in localStorage
      setCurrentUserId(user.id);
      
      // Redirect to applications page
      window.location.href = "/applications.html";
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed: " + err.message);
    }
  });
}
