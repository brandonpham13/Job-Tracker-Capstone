import {
  ApplicationsAPI,
  SkillsAPI,
  ApplicationSkillsAPI,
  ApplicationContactsAPI,
  ContactsAPI,
  getCurrentUserId,
} from "../api/fetch_api.js";

export function initAddApplicationsPage() {
  const applicationForm = document.querySelector(".add-application-form");
  const successOverlay = document.querySelector(".success-overlay");
  const submitAnother = document.querySelector(".submit-another");

  if (!applicationForm || !successOverlay) return;

  submitAnother.addEventListener("click", () => {
    successOverlay.classList.add("hidden");
    applicationForm.reset();
  });

  applicationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = getCurrentUserId();
    const formData = new FormData(applicationForm);

    const skillInputs = [
      formData.get("skill-1"),
      formData.get("skill-2"),
      formData.get("skill-3"),
    ]
      .filter(Boolean)
      .map((skill) => skill.trim());

    const skillIds = [];

    for (const skillName of skillInputs) {
      let existingSkill = await SkillsAPI.findByName(userId, skillName);

      if (!existingSkill) {
        existingSkill = await SkillsAPI.create(userId, {
          skill_name: skillName,
          category: "None",
        });
      }

      skillIds.push(existingSkill.skill_id);
    }

    const contactInputs = [
      formData.get("contact-1"),
      formData.get("contact-2"),
      formData.get("contact-3"),
    ]
      .filter(Boolean)
      .map((contact) => contact.trim());

    const contactIds = [];

    for (const contactName of contactInputs) {
      let existingContact = await ContactsAPI.findByName(userId, contactName);

      if (!existingContact) {
        existingContact = await ContactsAPI.create(userId, {
          name: contactName,
        });
      }

      contactIds.push(existingContact.contact_id);
    }

    const rawStatus = formData.get("status");
    const payload = {
      role: formData.get("role"),
      company_name: formData.get("company_name"),
      status: rawStatus ? rawStatus.toUpperCase() : undefined,
      application_date: formData.get("application_date") || null,
      skillIds,
    };

    try {
      const application = await ApplicationsAPI.create(userId, payload);
      const appId = application.app_id;

      for (const skillId of skillIds) {
        console.log(appId, skillId);
        await ApplicationSkillsAPI.create(appId, skillId);
      }

      for (const contactId of contactIds) {
        await ApplicationContactsAPI.create(appId, contactId);
      }
      successOverlay.classList.remove("hidden");
    } catch (err) {
      console.error("Failed to create application:", err);
      alert(`Could not create application: ${err.message}`);
    }
  });
}
