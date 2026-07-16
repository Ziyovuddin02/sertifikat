// Login tekshirish
if (localStorage.getItem("isLogin") !== "true") {
    window.location.href = "index.html";
}

// Ma'lumotnomalarni yuklash
async function loadCertificates() {

    const tableBody = document.getElementById("certificateTableBody");
    const certificateCount = document.getElementById("certificateCount");

    try {

        const response = await fetch("/api/certificates");

        if (!response.ok) {
            throw new Error("Serverdan ma'lumot kelmadi");
        }

        const certificates = await response.json();

        // Haqiqiy statistika
        certificateCount.textContent = certificates.length;

        tableBody.innerHTML = "";

        if (certificates.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        Hozircha ma'lumotnoma yaratilmagan.
                    </td>
                </tr>
            `;

            return;
        }

        certificates.forEach((certificate, index) => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>

                <td>${escapeHtml(certificate.certificateNo || "")}</td>

                <td>${escapeHtml(certificate.fullname || "")}</td>

                <td>${escapeHtml(certificate.course || "")}</td>

                <td>${formatDate(certificate.issueDate)}</td>

                <td>${escapeHtml(certificate.status || "")}</td>

              <td>
    <div class="action-buttons">

        <button
            class="btn btn-primary btn-sm"
            onclick="viewCertificate(${certificate.id})"
        >
            Ko'rish
        </button>

        <button
            class="btn btn-success btn-sm"
            onclick="printCertificate(${certificate.id})"
        >
            Print
        </button>

        <button
            class="btn btn-danger btn-sm"
            onclick="deleteCertificate(${certificate.id})"
        >
            O'chirish
        </button>

    </div>
</td>
            `;

            tableBody.appendChild(row);

        });

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Ma'lumotlarni yuklashda xatolik yuz berdi.
                </td>
            </tr>
        `;

    }

}

// Bitta ma'lumotnomani serverdan olish
async function getCertificate(id) {

    const response = await fetch(`/api/certificates/${id}`);

    if (!response.ok) {
        throw new Error("Ma'lumotnoma topilmadi");
    }

    return await response.json();

}

// Ko'rish
async function viewCertificate(id) {

    try {

        const certificate = await getCertificate(id);

        localStorage.setItem(
            "certificate",
            JSON.stringify(certificate)
        );

        window.location.href = "print.html";

    } catch (error) {

        console.error(error);
        alert("Ma'lumotnomani ochib bo'lmadi.");

    }

}

// Print
async function printCertificate(id) {

    try {

        const certificate = await getCertificate(id);

        localStorage.setItem(
            "certificate",
            JSON.stringify(certificate)
        );

        window.location.href = "print.html?print=true";

    } catch (error) {

        console.error(error);
        alert("Ma'lumotnomani chop etib bo'lmadi.");

    }

}

// O'chirish
async function deleteCertificate(id) {

    const confirmed = confirm(
        "Ushbu ma'lumotnomani o'chirmoqchimisiz?"
    );

    if (!confirmed) return;

    try {

        const response = await fetch(
            `/api/certificates/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("O'chirishda xatolik");
        }

        loadCertificates();

    } catch (error) {

        console.error(error);
        alert("Ma'lumotnomani o'chirib bo'lmadi.");

    }

}

// Sana formatlash
function formatDate(date) {

    if (!date) return "";

    const value = new Date(`${date}T00:00:00`);

    return value.toLocaleDateString("uz-UZ");

}

// Xavfsiz HTML chiqarish
function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

// Logout
function logout() {

    localStorage.removeItem("isLogin");
    localStorage.removeItem("adminName");

    window.location.href = "index.html";

}

document.addEventListener("DOMContentLoaded", loadCertificates);
document.addEventListener("DOMContentLoaded", function () {
    loadCertificates();
    loadIssuedCertificates();
    loadDiplomas();
});
// ===========================
// Sertifikatlarni yuklash
// ===========================

async function loadIssuedCertificates() {

    const count =
        document.getElementById("issuedCertificateCount");

    const table =
        document.getElementById("issuedCertificatesTableBody");

    try {

        const response =
            await fetch("/api/issued-certificates");

        if (!response.ok) {
            throw new Error("Sertifikatlarni olib bo'lmadi");
        }

        const certificates = await response.json();

        count.textContent = certificates.length;

        table.innerHTML = "";

        if (certificates.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        Hozircha sertifikat berilmagan.
                    </td>
                </tr>
            `;

            return;
        }

        certificates.forEach((certificate, index) => {

            table.innerHTML += `
                <tr>

                    <td>${index + 1}</td>

                    <td>${certificate.certificateNo}</td>

                    <td>${certificate.fullname}</td>

                    <td>${certificate.course}</td>

                    <td>${certificate.duration} oy</td>

                    <td>${formatDate(certificate.issueDate)}</td>

                  

                       

                       <td>
    <div class="action-buttons">

        <button
            class="btn btn-primary btn-sm"
            onclick="viewIssuedCertificate(${certificate.id})"
        >
            Ko'rish
        </button>

        <button
            class="btn btn-success btn-sm"
            onclick="printIssuedCertificate(${certificate.id})"
        >
            Print
        </button>

        <button
            class="btn btn-danger btn-sm"
            onclick="deleteIssuedCertificate(${certificate.id})"
        >
            O'chirish
        </button>

    </div>
</td>

                </tr>
            `;

        });

    } catch (err) {

        console.error(err);

    }

}

// Kartani bosganda ochish/yopish

function toggleIssuedCertificates() {

    const section =
        document.getElementById("issuedCertificatesSection");

    if (section.style.display === "none") {

        section.style.display = "block";

    } else {

        section.style.display = "none";

    }

}
async function viewIssuedCertificate(id){

    const response =
        await fetch(`/api/issued-certificates/${id}`);

    const certificate =
        await response.json();

    localStorage.setItem(
        "certificateData",
        JSON.stringify(certificate)
    );

    window.location.href = "certificate.html";

}
async function printIssuedCertificate(id){

    const response =
        await fetch(`/api/issued-certificates/${id}`);

    const certificate =
        await response.json();

    localStorage.setItem(
        "certificateData",
        JSON.stringify(certificate)
    );

    window.open("certificate.html?print=true");

}
async function deleteIssuedCertificate(id){

    if(!confirm("Sertifikatni o'chirmoqchimisiz?"))
        return;

    await fetch(`/api/issued-certificates/${id}`,{
        method:"DELETE"
    });

    loadIssuedCertificates();

}

async function loadDiplomas() {
    const count = document.getElementById("diplomaCount");
    const table = document.getElementById("diplomasTableBody");
    try {
        const response = await fetch("/api/diplomas");
        if (!response.ok) throw new Error("Diplomlarni olib bo‘lmadi");
        const diplomas = await response.json();
        count.textContent = diplomas.length;
        table.innerHTML = diplomas.length ? "" : '<tr><td colspan="7" class="text-center">Hozircha diplom berilmagan.</td></tr>';
        diplomas.forEach((diploma, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${escapeHtml(diploma.diplomaNo || "")}</td>
                <td>${escapeHtml(diploma.fullname || "")}</td>
                <td>${escapeHtml(diploma.course || "")}</td>
                <td>${escapeHtml(diploma.duration || "")}</td>
                <td>${formatDate(diploma.issueDate)}</td>
                <td><div class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="viewDiploma(${diploma.id})">Ko‘rish</button>
                    <button class="btn btn-success btn-sm" onclick="printDiploma(${diploma.id})">Print</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteDiploma(${diploma.id})">O‘chirish</button>
                </div></td>`;
            table.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        table.innerHTML = '<tr><td colspan="7" class="text-center">Diplomlarni yuklashda xatolik yuz berdi.</td></tr>';
    }
}

function toggleDiplomas() {
    const section = document.getElementById("diplomasSection");
    section.style.display = section.style.display === "none" ? "block" : "none";
}

async function getDiploma(id) {
    const response = await fetch(`/api/diplomas/${id}`);
    if (!response.ok) throw new Error("Diplom topilmadi");
    return response.json();
}

async function viewDiploma(id) {
    try {
        localStorage.setItem("diplomaData", JSON.stringify(await getDiploma(id)));
        window.location.href = "diploma.html";
    } catch (error) { alert(error.message); }
}

async function printDiploma(id) {
    try {
        localStorage.setItem("diplomaData", JSON.stringify(await getDiploma(id)));
        window.open("diploma.html?print=true");
    } catch (error) { alert(error.message); }
}

async function deleteDiploma(id) {
    if (!confirm("Diplomni o‘chirmoqchimisiz?")) return;
    const response = await fetch(`/api/diplomas/${id}`, { method: "DELETE" });
    if (!response.ok) return alert("Diplomni o‘chirib bo‘lmadi.");
    loadDiplomas();
}
