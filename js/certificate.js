// =======================================
// Sertifikat ma'lumotlarini olish
// =======================================

const certificateData = JSON.parse(
    localStorage.getItem("certificateData")
);

if (!certificateData) {
    alert("Sertifikat ma'lumotlari topilmadi.");
    window.location.href = "certificate-create.html";
}


// =======================================
// Sanani formatlash
// 2026-07-13 -> 13.07.2026
// =======================================

function formatDate(date) {
    if (!date) return "";

    const parts = date.split("-");

    if (parts.length !== 3) {
        return date;
    }

    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}


// =======================================
// Oy sonini yozuv bilan chiqarish
// =======================================

function getDurationText(duration) {
    const durationMap = {
        "1 oy": "1 (bir) oy",
        "2 oy": "2 (ikki) oy",
        "3 oy": "3 (uch) oy",
        "4 oy": "4 (to‘rt) oy",
        "5 oy": "5 (besh) oy",
        "6 oy": "6 (olti) oy",
        "7 oy": "7 (yetti) oy",
        "8 oy": "8 (sakkiz) oy",
        "9 oy": "9 (to‘qqiz) oy",
        "10 oy": "10 (o‘n) oy",
        "11 oy": "11 (o‘n bir) oy",
        "12 oy": "12 (o‘n ikki) oy"
    };

    return durationMap[duration] || duration;
}


// =======================================
// Har bir kurs uchun ko'nikmalar
// =======================================

const courseSkills = {
    "Frontend Dasturlash":
        "HTML, CSS, JavaScript hamda zamonaviy veb-texnologiyalar asosida veb-saytlar yaratish",

    "Backend Node.js":
        "Node.js, Express.js, REST API, ma’lumotlar bazalari va server dasturlash texnologiyalari asosida veb-ilovalarning backend qismini yaratish",

    "Python":
        "Python dasturlash tili, obyektga yo‘naltirilgan dasturlash, ma’lumotlar bazasi, API va avtomatlashtirish vositalari bilan ishlash",

    "Grafik Dizayn":
        "Adobe Photoshop, Adobe Illustrator, CorelDRAW va Canva dasturlarida logotip, banner, reklama va boshqa grafik materiallarni yaratish",

    "Kompyuter Savodxonligi":
        "Microsoft Word, Excel, PowerPoint, internet xizmatlari, elektron pochta va kompyuter dasturlaridan samarali foydalanish",

    "Ingliz tili":
        "grammatika, so‘z boyligi, o‘qish, yozish, tinglab tushunish va erkin muloqot qilish",

    "SMM":
        "ijtimoiy tarmoqlarni yuritish, kontent reja tuzish, reklama kampaniyalari yaratish va auditoriya bilan ishlash"
};


// =======================================
// Asosiy sertifikat matnini yaratish
// =======================================

function createCertificateText() {
    const course = certificateData.course;
    const duration = getDurationText(certificateData.duration);

    const skills =
        courseSkills[course] ||
        "mazkur yo‘nalish bo‘yicha nazariy va amaliy ko‘nikmalarni egallash";

    return `Mazkur sertifikat, ${course} yo‘nalishi bo‘yicha ${duration} davomida nazariy va amaliy bilimlarni o‘z ichiga olgan o‘quv dasturini to‘liq o‘zlashtirib, ${skills} ko‘nikmalarini muvaffaqiyatli egallaganligi, barcha belgilangan topshiriq va yakuniy baholash jarayonlaridan muvaffaqiyatli o‘tib, kursni to‘liq tamomlaganligi munosabati bilan taqdim etildi.`;
}


// =======================================
// HTML elementlarini xavfsiz topish
// =======================================

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


// =======================================
// Sertifikatga ma'lumotlarni chiqarish
// =======================================

setText("studentFullname", certificateData.fullname);

setText("courseName", certificateData.course);

setText(
    "courseDuration",
    getDurationText(certificateData.duration)
);

setText(
    "startDate",
    formatDate(certificateData.startDate)
);

setText(
    "endDate",
    formatDate(certificateData.endDate)
);

setText(
    "issueDate",
    formatDate(certificateData.issueDate)
);

setText(
    "certificateNumber",
    certificateData.certificateNo
);

setText(
    "qrCertificateNo",
    certificateData.certificateNo
);


// =======================================
// Sertifikat matni
// =======================================

const descriptionElement =
    document.getElementById("customDescription");

if (descriptionElement) {
    descriptionElement.textContent = createCertificateText();
}


// =======================================
// QR kod ma'lumotlari
// =======================================

const qrText = [
    "DASTURLASH AKADEMIYASI",
    `Sertifikat: ${certificateData.certificateNo}`,
    `F.I.Sh: ${certificateData.fullname}`,
    `Kurs: ${certificateData.course}`,
    `Davomiyligi: ${getDurationText(certificateData.duration)}`,
    `Boshlanish: ${formatDate(certificateData.startDate)}`,
    `Tugash: ${formatDate(certificateData.endDate)}`,
    `Berilgan sana: ${formatDate(certificateData.issueDate)}`
].join("\n");

const qrElement = document.getElementById("qrcode");

if (qrElement && typeof QRCode !== "undefined") {
    qrElement.innerHTML = "";

    new QRCode(qrElement, {
        text: qrText,
        width: 90,
        height: 90,
        correctLevel: QRCode.CorrectLevel.H
    });
}


function downloadCertificate() {
    const element = document.getElementById("certificatePage");

    if (!element) {
        alert("Sertifikat topilmadi.");
        return;
    }

    if (typeof html2pdf === "undefined") {
        alert("PDF kutubxonasi yuklanmadi.");
        return;
    }

    const safeName = certificateData.fullname
        .replace(/[^\p{L}\p{N}]+/gu, "_")
        .replace(/^_+|_+$/g, "");

    const oldMargin = element.style.margin;
    const oldBoxShadow = element.style.boxShadow;
    const oldWidth = element.style.width;
    const oldHeight = element.style.height;

    element.style.margin = "0";
    element.style.boxShadow = "none";
    element.style.width = "296mm";
    element.style.height = "209mm";

    const options = {
        margin: 0,

        filename:
            `${safeName}_${certificateData.certificateNo}.pdf`,

        image: {
            type: "jpeg",
            quality: 1
        },

        html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            scrollX: 0,
            scrollY: 0
        },

        jsPDF: {
            unit: "mm",
            format: [297, 210],
            orientation: "landscape"
        }
    };

    html2pdf()
        .set(options)
        .from(element)
        .save()
        .then(function () {
            element.style.margin = oldMargin;
            element.style.boxShadow = oldBoxShadow;
            element.style.width = oldWidth;
            element.style.height = oldHeight;
        })
        .catch(function (error) {
            element.style.margin = oldMargin;
            element.style.boxShadow = oldBoxShadow;
            element.style.width = oldWidth;
            element.style.height = oldHeight;

            console.error("PDF xatosi:", error);
            alert("PDF yaratishda xatolik yuz berdi.");
        });
}