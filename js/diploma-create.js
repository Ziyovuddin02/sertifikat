if (localStorage.getItem("isLogin") !== "true") window.location.href = "index.html";

const form = document.getElementById("diplomaForm");
const issueDateInput = document.getElementById("issueDate");
const diplomaNoInput = document.getElementById("diplomaNo");
issueDateInput.value = new Date().toISOString().split("T")[0];

async function loadNextDiplomaNumber() {
    const year = new Date().getFullYear();
    try {
        const response = await fetch("/api/diplomas");
        if (!response.ok) throw new Error();
        const diplomas = await response.json();
        const max = diplomas.reduce((value, diploma) => {
            const number = Number(String(diploma.diplomaNo || "").split("-").pop());
            return Number.isNaN(number) ? value : Math.max(value, number);
        }, 0);
        diplomaNoInput.value = `DIP-${year}-${String(max + 1).padStart(3, "0")}`;
    } catch (_) {
        diplomaNoInput.value = `DIP-${year}-001`;
    }
}

loadNextDiplomaNumber();

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = id => document.getElementById(id).value.trim();
    const data = {
        fullname: value("fullname"), course: value("course"), duration: value("duration"),
        startDate: value("startDate"), endDate: value("endDate"), issueDate: value("issueDate"),
        diplomaNo: value("diplomaNo"), director: value("director"), description: value("description")
    };
    if (data.startDate > data.endDate) return Swal.fire("Xatolik", "Tugash sanasi boshlanish sanasidan oldin bo‘lishi mumkin emas.", "error");
    try {
        const response = await fetch("/api/diplomas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Diplom saqlanmadi.");
        data.id = result.id;
        localStorage.setItem("diplomaData", JSON.stringify(data));
        await Swal.fire({ toast: true, position: "bottom-end", icon: "success", title: "Diplom yaratildi!", showConfirmButton: false, timer: 1300 });
        window.location.href = "diploma.html";
    } catch (error) {
        Swal.fire("Xatolik", error.message, "error");
    }
});
