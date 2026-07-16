// ===============================
// Dasturlash Akademiyasi
// create.js
// ===============================


// Bugungi sanani avtomatik chiqarish
const today = new Date().toISOString().split("T")[0];

document.getElementById("issueDate").value = today;


// ===============================
// Ma'lumotnoma raqamini yaratish
// Format:
// DA-2026-01
// DA-2026-02
// DA-2026-03
// ===============================

const currentYear = new Date().getFullYear();

let certificateCounter =
    Number(localStorage.getItem(`certificateCounter-${currentYear}`)) || 0;

// Keyingi raqam
certificateCounter++;

// Raqamni vaqtincha saqlash
localStorage.setItem(
    `certificateCounter-${currentYear}`,
    certificateCounter
);

// 01, 02, 03 ko'rinishida chiqarish
const formattedCounter = String(certificateCounter).padStart(2, "0");

const certificateNumber =
    `DA-${currentYear}-${formattedCounter}`;

document.getElementById("certificateNo").value = certificateNumber;


// ===============================
// Formani yuborish
// ===============================

document
    .getElementById("certificateForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const fullname =
            document.getElementById("fullname").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const course =
            document.getElementById("course").value;

        const status =
            document.getElementById("status").value;

        const startDate =
            document.getElementById("startDate").value;

        const endDate =
            document.getElementById("endDate").value;

        const issueDate =
            document.getElementById("issueDate").value;

        const certificateNo =
            document.getElementById("certificateNo").value;

        const purposeElement =
            document.getElementById("purpose");

        const purpose = purposeElement
            ? purposeElement.value.trim()
            : "Talab qilingan joyga taqdim etish uchun";


        // ===============================
        // Tekshiruv
        // ===============================

        if (!fullname) {
            alert("O'quvchining F.I.Sh. qismini kiriting.");
            return;
        }

        if (!course) {
            alert("Kurs yoki fan nomini tanlang.");
            return;
        }

        if (!startDate) {
            alert("Boshlanish sanasini kiriting.");
            return;
        }

        if (!endDate) {
            alert("Tugash sanasini kiriting.");
            return;
        }

        if (startDate > endDate) {
            alert("Tugash sanasi boshlanish sanasidan oldin bo'lishi mumkin emas.");
            return;
        }


        // Serverga yuboriladigan ma'lumot
        const data = {
            fullname: fullname,
            phone: phone,
            course: course,
            status: status,
            startDate: startDate,
            endDate: endDate,
            issueDate: issueDate,
            certificateNo: certificateNo,
            purpose: purpose
        };


        try {

            const response = await fetch("/api/certificates", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            });


            if (!response.ok) {

                const errorText = await response.text();

                throw new Error(
                    errorText || "Serverda xatolik yuz berdi."
                );

            }


            const result = await response.json();

            data.id = result.id;


            // Print sahifasi uchun saqlash
            localStorage.setItem(
                "certificate",
                JSON.stringify(data)
            );


           Swal.fire({

    toast: true,

    position: "bottom-end",

    icon: "success",

    title: "✅ Ma'lumotnoma muvaffaqiyatli yaratildi!",

    showConfirmButton: false,

    timer: 2000,

    timerProgressBar: true

});

setTimeout(() => {

    window.location.href = "print.html";

}, 2500);


           

        } catch (error) {

            console.error("Xatolik:", error);

            alert(
                "Ma'lumotnoma saqlanmadi. Server ishlayotganini tekshiring."
            );

        }

    });
    