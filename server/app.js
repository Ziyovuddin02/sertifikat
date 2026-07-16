const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;


// =====================================
// Middleware
// =====================================

app.use(cors());

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);


// =====================================
// Frontend fayllari
// =====================================

app.use(
    express.static(
        path.join(__dirname, "../")
    )
);


// =====================================
// SQLite bazasi
// =====================================

const databasePath = path.join(
    __dirname,
    "database.db"
);

const db = new sqlite3.Database(
    databasePath,
    function (error) {

        if (error) {

            console.error(
                "Database ulanishida xatolik:",
                error.message
            );

        } else {

            console.log(
                "SQLite bazasiga muvaffaqiyatli ulanildi."
            );

        }

    }
);


// =====================================
// Jadvallarni yaratish
// =====================================

db.serialize(() => {

    // ---------------------------------
    // Ma'lumotnomalar jadvali
    // ---------------------------------

    db.run(
        `
        CREATE TABLE IF NOT EXISTS certificates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            fullname TEXT NOT NULL,

            phone TEXT,

            course TEXT NOT NULL,

            status TEXT NOT NULL,

            startDate TEXT,

            endDate TEXT,

            issueDate TEXT NOT NULL,

            certificateNo TEXT UNIQUE NOT NULL,

            purpose TEXT,

            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `,
        function (error) {

            if (error) {

                console.error(
                    "Ma'lumotnomalar jadvalini yaratishda xatolik:",
                    error.message
                );

            } else {

                console.log(
                    "Ma'lumotnomalar jadvali tayyor."
                );

            }

        }
    );


    // ---------------------------------
    // Sertifikatlar jadvali
    // ---------------------------------

    db.run(
        `
        CREATE TABLE IF NOT EXISTS issued_certificates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            fullname TEXT NOT NULL,

            course TEXT NOT NULL,

            duration TEXT NOT NULL,

            startDate TEXT,

            endDate TEXT,

            issueDate TEXT NOT NULL,

            certificateNo TEXT UNIQUE NOT NULL,

            description TEXT,

            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `,
        function (error) {

            if (error) {

                console.error(
                    "Sertifikatlar jadvalini yaratishda xatolik:",
                    error.message
                );

            } else {

                console.log(
                    "Sertifikatlar jadvali tayyor."
                );

            }

        }
    );

    // Diplomlar jadvali
    db.run(
        `
        CREATE TABLE IF NOT EXISTS diplomas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullname TEXT NOT NULL,
            course TEXT NOT NULL,
            duration TEXT NOT NULL,
            startDate TEXT NOT NULL,
            endDate TEXT NOT NULL,
            issueDate TEXT NOT NULL,
            diplomaNo TEXT UNIQUE NOT NULL,
            director TEXT,
            description TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `,
        function (error) {
            if (error) {
                console.error("Diplomlar jadvalini yaratishda xatolik:", error.message);
            } else {
                console.log("Diplomlar jadvali tayyor.");
            }
        }
    );

});


// =====================================
// API route'lar
// =====================================

const routes = require("./routes")(db);

app.use("/api", routes);


// =====================================
// Asosiy sahifa
// =====================================

app.get("/", function (req, res) {

    res.sendFile(
        path.join(
            __dirname,
            "../index.html"
        )
    );

});


// =====================================
// 404 xatolik
// =====================================

app.use(function (req, res) {

    res.status(404).json({
        success: false,
        message: "Sahifa yoki API topilmadi."
    });

});


// =====================================
// Serverni ishga tushirish
// =====================================

app.listen(PORT, function () {

    console.log("");
    console.log("Server muvaffaqiyatli ishga tushdi.");
    console.log(`http://localhost:${PORT}`);
    console.log("");

});


// =====================================
// Server to'xtaganda bazani yopish
// =====================================

process.on("SIGINT", function () {

    db.close(function (error) {

        if (error) {

            console.error(
                "Database yopilishida xatolik:",
                error.message
            );

        } else {

            console.log(
                "SQLite bazasi yopildi."
            );

        }

        process.exit(0);

    });

});
