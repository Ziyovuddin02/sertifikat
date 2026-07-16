const data = JSON.parse(localStorage.getItem("certificate"));

if(data){

document.getElementById("fullname").innerHTML = data.fullname;

document.getElementById("course").innerHTML = data.course;

document.getElementById("startDate").innerHTML = formatDate(data.startDate);

document.getElementById("endDate").innerHTML = formatDate(data.endDate);

document.getElementById("issueDate").innerHTML = formatDate(data.issueDate);

document.getElementById("certificateNo").innerHTML = data.certificateNo;



if (data.status === "Tamomlagan") {
    document.getElementById("status").textContent = "ta'lim olganligini tasdiqlaymiz";
} else {
    document.getElementById("status").textContent = "ta'lim olayotganligini tasdiqlaymiz";
}
}
// Sana formatlash

function formatDate(date){

if(!date) return "";

const d=new Date(date);

return d.toLocaleDateString("uz-UZ");

}
window.onload = function () {

    const qr = document.getElementById("qrcode");

    if (!qr) {
        console.log("QR div topilmadi");
        return;
    }

    qr.innerHTML = "";

    new QRCode(qr, {
        text: data.certificateNo,
        width: 100,
        height: 100
    });

};
function downloadPDF() {
    const element = document.querySelector(".certificate");

    if (!element) {
        alert("Ma'lumotnoma topilmadi");
        return;
    }

    if (typeof html2pdf === "undefined") {
        alert("PDF kutubxonasi yuklanmadi. Internetni tekshiring.");
        return;
    }

    const fileName = data && data.fullname
        ? `${data.fullname.replace(/\s+/g, "_")}_malumotnoma.pdf`
        : "Malumotnoma.pdf";

    const options = {
        margin: 0,
        filename: fileName,

        image: {
            type: "jpeg",
            quality: 1
        },

        html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true
        },

        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait"
        }
    };

    html2pdf()
        .set(options)
        .from(element)
        .save()
        .catch(function (error) {
            console.error(error);
            alert("PDF yaratishda xatolik yuz berdi.");
        });
}