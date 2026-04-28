const applicationsPage = document.querySelector(".my-applications");
const addApplicationPage = document.querySelector(".add-application");
const contactsPage = document.querySelector(".my-applications");
const addContactPage = document.querySelector(".my-applications");
const editApplicationPage = document.querySelector(".edit-application");
const editContactPage = document.querySelector(".edit-contact");
const loginPage = document.querySelector(".login");
const registrationPage = document.querySelector(".login");
const trendsPage = document.querySelector(".summary-data");

if (applicationsPage) {
  const deletedOverlay = document.querySelector(".deleted-overlay");
  const deleteButton = document.querySelector(".delete-btn");
  const confirmDelete = document.querySelector(".confirm-delete");
  const cancelDelete = document.querySelector(".cancel-delete");
  const filterSortOverlay = document.querySelector(".filter-sort-overlay");
  const filterSortButton = document.querySelector(".filter-sort-btn");
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

  filterSortButton.addEventListener("click", openFilerSortOverlay);
  clearFilters.addEventListener("click", closeFilerSortOverlay);
  submitFilters.addEventListener("click", closeFilerSortOverlay);
  deleteButton.addEventListener("click", openDeletedOverlay);
  confirmDelete.addEventListener("click", closeDeletedOverlay);
  cancelDelete.addEventListener("click", closeDeletedOverlay);
}

if (addApplicationPage) {
  const applicationForm = document.querySelector(".add-application-form");
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

  applicationForm.addEventListener("submit", openSuccessOverlay);
  closeModal.addEventListener("click", closeSuccess);
}
