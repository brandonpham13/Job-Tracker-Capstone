import "./api/fetch_api.js";

const applicationsPage = document.querySelector(".my-applications");
const addApplicationPage = document.querySelector(".add-application");
const contactsPage = document.querySelector(".my-contacts");
const addContactPage = document.querySelector(".add-contact");
const addSkillPage = document.querySelector(".add-skill");
const editApplicationPage = document.querySelector(".edit-application");
const editContactPage = document.querySelector(".edit-contact");
const editSkillPage = document.querySelector(".edit-skill");
const loginPage = document.querySelector(".login");
const registrationPage = document.querySelector(".login");
const trendsPage = document.querySelector(".summary-data");
const skillsPage = document.querySelector(".my-skills");

if (applicationsPage) {
  import("./pages/applications.js").then((m) => {
    m.initApplicationsPage();
  });
}

if (addApplicationPage) {
  import("./pages/addApplication.js").then((m) => {
    m.initAddApplicationsPage();
  });
}

if (editApplicationPage) {
  import("./pages/editApplication.js").then((m) => {
    m.initEditApplicationPage();
  });
}

if (contactsPage) {
  import("./pages/contacts.js").then((m) => {
    m.initContactsPage();
  });
}

if (addContactPage) {
  import("./pages/addContact.js").then((m) => {
    m.initAddContactsPage();
  });
}

if (editContactPage) {
  import("./pages/editContact.js").then((m) => {
    m.initEditContactPage();
  });
}

if (skillsPage) {
  import("./pages/skills.js").then((m) => {
    m.initSkillsPage();
  });
}

if (addSkillPage) {
  import("./pages/addSkill.js").then((m) => {
    m.initAddSkillsPage();
  });
}

if (editSkillPage) {
  import("./pages/editSkill.js").then((m) => {
    m.initEditSkillPage();
  });
}

if (trendsPage) {
  import("./pages/trends.js").then((m) => {
    m.initTrendsPage();
  });
}
