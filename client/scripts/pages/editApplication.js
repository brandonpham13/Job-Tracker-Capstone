import {
  ApplicationsAPI,
  ApplicationSkillsAPI,
  ApplicationContactsAPI,
  getCurrentUserId,
  SkillsAPI,
  ContactsAPI,
} from "../api/fetch_api.js";

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
    const skills = await ApplicationSkillsAPI.listByApplication(appId);
    const contacts = await ApplicationContactsAPI.listByApplication(appId);

    console.log("Application data:", app);

    // Pre-populate main application data
    roleInput.value = app.role || "";
    companyInput.value = app.company_name || "";
    statusInput.value = app.status || "";

    // datetime-local requires YYYY-MM-DDTHH:mm
    if (app.application_date) {
      dateInput.value = app.application_date.slice(0, 16);
    }

    // Pre-populate skills
    skill1.value = skills[0]?.skill?.skill_name || "";
    skill2.value = skills[1]?.skill?.skill_name || "";
    skill3.value = skills[2]?.skill?.skill_name || "";

    // Pre-populate contacts
    contact1.value = contacts[0]?.contact?.name || "";
    contact2.value = contacts[1]?.contact?.name || "";
    contact3.value = contacts[2]?.contact?.name || "";
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
    };

    try {
      await ApplicationsAPI.update(appId, userId, updatedData);
      const skillInputs = [skill1.value, skill2.value, skill3.value]
        .filter(Boolean)
        .map((s) => s.trim());

      const existingSkills =
        await ApplicationSkillsAPI.listByApplication(appId);
      for (const s of existingSkills) {
        await ApplicationSkillsAPI.delete(appId, s.skill_id);
      }

      for (const skillName of skillInputs) {
        let skill = await SkillsAPI.findByName(userId, skillName);

        if (!skill) {
          skill = await SkillsAPI.create(userId, {
            skill_name: skillName,
            category: "None",
          });
        }

        await ApplicationSkillsAPI.create(appId, skill.skill_id);
      }

      const contactInputs = [contact1.value, contact2.value, contact3.value]
        .filter(Boolean)
        .map((c) => c.trim());

      const existingContacts =
        await ApplicationContactsAPI.listByApplication(appId);
      for (const c of existingContacts) {
        await ApplicationContactsAPI.delete(appId, c.contact_id);
      }

      for (const contactName of contactInputs) {
        let contact = await ContactsAPI.findByName(userId, contactName);

        if (!contact) {
          contact = await ContactsAPI.create(userId, {
            name: contactName,
          });
        }

        await ApplicationContactsAPI.create(appId, contact.contact_id);
      }
      window.location.href = "applications.html";
    } catch (err) {
      console.error("Update failed:", err);
    }
  });
}
