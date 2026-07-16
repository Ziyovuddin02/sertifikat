const diplomaData = JSON.parse(localStorage.getItem("diplomaData"));
if (!diplomaData) { alert("Diplom ma’lumotlari topilmadi."); window.location.href = "diploma-create.html"; }

function formatDate(date) {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
}

const values = {
    fullname: diplomaData.fullname,
    course: diplomaData.course,
    duration: diplomaData.duration,
    startDate: formatDate(diplomaData.startDate),
    endDate: formatDate(diplomaData.endDate),
    endYear: (diplomaData.endDate || "").split("-")[0],
    issueDate: formatDate(diplomaData.issueDate),
    diplomaNo: diplomaData.diplomaNo,
    director: diplomaData.director || "________________"
};

document.querySelectorAll("[data-bind]").forEach(element => {
    element.textContent = values[element.dataset.bind] || "";
});

const verificationUrl = `${window.location.origin}/api/verify-diploma/${encodeURIComponent(diplomaData.diplomaNo)}`;
["qrcodeUz", "qrcodeEn"].forEach(id => new QRCode(document.getElementById(id), {
    text: verificationUrl, width: 72, height: 72, correctLevel: QRCode.CorrectLevel.H
}));

async function downloadDiploma() {
    if (typeof html2pdf === "undefined") return alert("PDF kutubxonasi yuklanmadi.");
    const safeName = diplomaData.fullname.replace(/[^\p{L}\p{N}]+/gu, "_").replace(/^_+|_+$/g, "");
    document.body.classList.add("exporting");
    try {
        await html2pdf().set({
            margin: 0,
            filename: `${safeName}_${diplomaData.diplomaNo}.pdf`,
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 2.5, useCORS: true, backgroundColor: "#fff", scrollX: 0, scrollY: 0 },
            jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }
        }).from(document.getElementById("diplomaSheet")).save();
    } finally { document.body.classList.remove("exporting"); }
}

if (new URLSearchParams(location.search).get("print") === "true") {
    window.addEventListener("load", () => setTimeout(() => window.print(), 500));
}
