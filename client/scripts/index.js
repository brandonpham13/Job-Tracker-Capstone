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

if (contactsPage) {
  import("./pages/contacts.js");

  const deleteButton = document.querySelector(".delete-btn");
  const confirmDelete = document.querySelector(".confirm-delete");
  const cancelDelete = document.querySelector(".cancel-delete");
  const deletedOverlay = document.querySelector(".deleted-overlay");
  const filterSortOverlay = document.querySelector(".filter-sort-overlay");
  const filterContactsBtn = document.querySelector(".filter-contacts");
  const clearFilters = document.querySelector(".clear-filters");
  const submitFilters = document.querySelector(".submit-filters");

  /* open delete application overlay */
  const openDeletedOverlay = function () {
    deletedOverlay.classList.remove("hidden");
  };

  /* close delete application overlay */
  const closeDeletedOverlay = function () {
    deletedOverlay.classList.add("hidden");
  };

  /* open filter-sort overlay */
  const openFilerSortOverlay = function () {
    filterSortOverlay.classList.remove("hidden");
  };

  /* close filter-sort  overlay */
  const closeFilerSortOverlay = function () {
    filterSortOverlay.classList.add("hidden");
  };

  filterContactsBtn.addEventListener("click", openFilerSortOverlay);
  clearFilters.addEventListener("click", closeFilerSortOverlay);
  submitFilters.addEventListener("click", closeFilerSortOverlay);
  deleteButton.addEventListener("click", openDeletedOverlay);
  confirmDelete.addEventListener("click", closeDeletedOverlay);
  cancelDelete.addEventListener("click", closeDeletedOverlay);
}

if (addContactPage) {
  import("./pages/addContact.js").then((m) => {
    m.initAddContactsPage();
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

if (trendsPage) {
  import("./pages/trends.js");
}
