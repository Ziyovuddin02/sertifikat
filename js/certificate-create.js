const form = document.getElementById("certificateForm");

const issueDateInput = document.getElementById("issueDate");
const certificateNoInput = document.getElementById("certificateNo");

// Bugungi sana
const today = new Date().toISOString().split("T")[0];
issueDateInput.value = today;

// Joriy yil
const currentYear = new Date().getFullYear();


// Keyingi sertifikat raqamini bazadan olish
async function loadNextCertificateNumber() {
    try {
        const response = await fetch("/api/issued-certificates");

        if (!response.ok) {
            throw new Error("Sertifikatlar ro‘yxati olinmadi.");
        }

        const certificates = await response.json();

        let maxNumber = 0;

        certificates.forEach((certificate) => {
            const numberText = certificate.certificateNo || "";

            const parts = numberText.split("-");

            const lastPart = Number(parts[parts.length - 1]);

            if (!Number.isNaN(lastPart) && lastPart > maxNumber) {
                maxNumber = lastPart;
            }
        });

        const nextNumber = maxNumber + 1;

        certificateNoInput.value =
            `CERT-${currentYear}-${String(nextNumber).padStart(2, "0")}`;

    } catch (error) {
        console.error(error);

        certificateNoInput.value =
            `CERT-${currentYear}-01`;
    }
}

loadNextCertificateNumber();


// Sertifikatni saqlash
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullname =
        document.getElementById("fullname").value.trim();

    const course =
        document.getElementById("course").value.trim();

    const duration =
        document.getElementById("duration").value;

    const startDate =
        document.getElementById("startDate").value;

    const endDate =
        document.getElementById("endDate").value;

    const issueDate =
        document.getElementById("issueDate").value;

    const certificateNo =
        document.getElementById("certificateNo").value;

    const descriptionElement =
        document.getElementById("description");

    const description = descriptionElement
        ? descriptionElement.value.trim()
        : "";

    if (
        !fullname ||
        !course ||
        !duration ||
        !startDate ||
        !endDate ||
        !issueDate ||
        !certificateNo
    ) {
        alert("Barcha majburiy maydonlarni to‘ldiring.");
        return;
    }

    if (startDate > endDate) {
        alert(
            "Tugash sanasi boshlanish sanasidan oldin bo‘lishi mumkin emas."
        );
        return;
    }

    const data = {
        fullname,
        course,
        duration,
        startDate,
        endDate,
        issueDate,
        certificateNo,
        description
    };

    try {
        const response = await fetch(
            "/api/issued-certificates",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Sertifikat bazaga saqlanmadi."
            );
        }

              data.id = result.id;

        localStorage.setItem(
            "certificateData",
            JSON.stringify(data)
        );

        Swal.fire({
            toast: true,
            position: "bottom-end",
            icon: "success",
            title: "✅ Sertifikat muvaffaqiyatli yaratildi!",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
        });

        setTimeout(() => {
            window.location.href = "certificate.html";
        }, 2000);

    } catch (error) {

        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Xatolik!",
            text: error.message,
            confirmButtonText: "Yopish"
        });

    }

});