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

// Registration page initialization
if (registrationPage) {
  import("./pages/registration.js").then((m) => {
    m.initRegistrationPage();
  });
}

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
  import("./pages/addContact.js");

  const contactForm = document.querySelector(".add-contact-form");
  const successOverlay = document.querySelector(".success-overlay");
  const closeModal = document.querySelector(".close-modal");

  /* open success overlay */
  const openSuccessOverlay = function () {
    event.preventDefault();
    successOverlay.classList.remove("hidden");
  };

  /* close success overlay */
  const closeSuccess = function () {
    successOverlay.classList.add("hidden");
  };

  contactForm.addEventListener("submit", openSuccessOverlay);
  closeModal.addEventListener("click", closeSuccess);
}

if (skillsPage) {
  import("./pages/skills.js");

  const deleteButton = document.querySelector(".delete-btn");
  const confirmDelete = document.querySelector(".confirm-delete");
  const cancelDelete = document.querySelector(".cancel-delete");
  const deletedOverlay = document.querySelector(".deleted-overlay");
  const filterSortOverlay = document.querySelector(".filter-sort-overlay");
  const filterSkillsBtn = document.querySelector(".filter-sort-btn");
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

  filterSkillsBtn.addEventListener("click", openFilerSortOverlay);
  clearFilters.addEventListener("click", closeFilerSortOverlay);
  submitFilters.addEventListener("click", closeFilerSortOverlay);
  deleteButton.addEventListener("click", openDeletedOverlay);
  confirmDelete.addEventListener("click", closeDeletedOverlay);
  cancelDelete.addEventListener("click", closeDeletedOverlay);
}

if (addSkillPage) {
  import("./pages/addSkill.js");

  const skillForm = document.querySelector(".add-skill-form");
  const successOverlay = document.querySelector(".success-overlay");
  const closeModal = document.querySelector(".close-modal");

  /* open success overlay */
  const openSuccessOverlay = function () {
    event.preventDefault();
    successOverlay.classList.remove("hidden");
  };

  /* close success overlay */
  const closeSuccess = function () {
    successOverlay.classList.add("hidden");
  };

  skillForm.addEventListener("submit", openSuccessOverlay);
  closeModal.addEventListener("click", closeSuccess);
}

if (trendsPage) {
  import("./pages/trends.js");
}
