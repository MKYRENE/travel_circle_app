document.addEventListener("DOMContentLoaded", function () {
    const errorModal = document.getElementById("errorModal");
    const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get("error");

    if (errorMessage) {
        errorModal.classList.add("show");
        errorModal.style.display = "block";
        document.body.classList.add("modal-open");
    }
});