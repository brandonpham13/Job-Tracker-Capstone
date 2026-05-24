import { ApplicationsAPI, getCurrentUserId } from "../api/fetch_api.js";

export async function initEditApplicationPage() {
  const form = document.querySelector(".edit-application-form");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const appId = params.get("id");

  if (!appId) return;

  const userId = getCurrentUserId();

  // Form fields
  const roleInput = document.querySelector("#role");
  const companyInput = document.querySelector("#company_name");
  const statusInput = document.querySelector("#status");
  const dateInput = document.querySelector("#application_date");

  const skill1 = document.querySelector("#skill-1");
  const skill2 = document.querySelector("#skill-2");
  const skill3 = document.querySelector("#skill-3");

  const contact1 = document.querySelector("#contact-1");
  const contact2 = document.querySelector("#contact-2");
  const contact3 = document.querySelector("#contact-3");

  try {
    const app = await ApplicationsAPI.getById(appId, userId);

    // Pre-populate main application data
    roleInput.value = app.role || "";
    companyInput.value = app.company_name || "";
    statusInput.value = app.status || "";

    // datetime-local requires YYYY-MM-DDTHH:mm
    if (app.application_date) {
      dateInput.value = app.application_date.slice(0, 16);
    }

    // Pre-populate skills
    skill1.value = app.skills?.[0] || "";
    skill2.value = app.skills?.[1] || "";
    skill3.value = app.skills?.[2] || "";

    // Pre-populate contacts
    contact1.value = app.contacts?.[0] || "";
    contact2.value = app.contacts?.[1] || "";
    contact3.value = app.contacts?.[2] || "";
  } catch (err) {
    console.error("Failed loading application:", err);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const rawStatus = formData.get("status");

    const updatedData = {
      role: roleInput.value,
      company_name: companyInput.value,
      status: rawStatus ? rawStatus.toUpperCase() : undefined,
      application_date: dateInput.value,

      skills: [skill1.value, skill2.value, skill3.value].filter(Boolean),

      contacts: [contact1.value, contact2.value, contact3.value].filter(
        Boolean,
      ),
    };

    try {
      await ApplicationsAPI.update(appId, userId, updatedData);

      window.location.href = "applications.html";
    } catch (err) {
      console.error("Update failed:", err);
    }
  });
}
