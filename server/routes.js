const express = require("express");

module.exports = function (db) {

    const router = express.Router();


    // =====================================
    // BARCHA MA'LUMOTNOMALAR
    // =====================================

    router.get("/certificates", (req, res) => {

        db.all(
            "SELECT * FROM certificates ORDER BY id DESC",
            [],
            (error, rows) => {

                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: error.message
                    });
                }

                res.json(rows);
            }
        );

    });


    // =====================================
    // BITTA MA'LUMOTNOMA
    // =====================================

    router.get("/certificates/:id", (req, res) => {

        db.get(
            "SELECT * FROM certificates WHERE id = ?",
            [req.params.id],
            (error, row) => {

                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: error.message
                    });
                }

                if (!row) {
                    return res.status(404).json({
                        success: false,
                        message: "Ma'lumotnoma topilmadi."
                    });
                }

                res.json(row);
            }
        );

    });


    // =====================================
    // YANGI MA'LUMOTNOMA SAQLASH
    // =====================================

    router.post("/certificates", (req, res) => {

        const {
            fullname,
            phone,
            course,
            status,
            startDate,
            endDate,
            issueDate,
            certificateNo,
            purpose
        } = req.body;

        if (
            !fullname ||
            !course ||
            !status ||
            !issueDate ||
            !certificateNo
        ) {
            return res.status(400).json({
                success: false,
                message: "Majburiy maydonlar to‘ldirilmagan."
            });
        }

        db.run(
            `
            INSERT INTO certificates (
                fullname,
                phone,
                course,
                status,
                startDate,
                endDate,
                issueDate,
                certificateNo,
                purpose
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                fullname,
                phone,
                course,
                status,
                startDate,
                endDate,
                issueDate,
                certificateNo,
                purpose
            ],
            function (error) {

                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: error.message
                    });
                }

                res.json({
                    success: true,
                    id: this.lastID
                });
            }
        );

    });


    // =====================================
    // MA'LUMOTNOMANI O'CHIRISH
    // =====================================

    router.delete("/certificates/:id", (req, res) => {

        db.run(
            "DELETE FROM certificates WHERE id = ?",
            [req.params.id],
            function (error) {

                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: error.message
                    });
                }

                res.json({
                    success: true
                });
            }
        );

    });


    // =====================================
    // BARCHA SERTIFIKATLAR
    // =====================================

    router.get("/issued-certificates", (req, res) => {

        db.all(
            "SELECT * FROM issued_certificates ORDER BY id DESC",
            [],
            (error, rows) => {

                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: error.message
                    });
                }

                res.json(rows);
            }
        );

    });


    // =====================================
    // BITTA SERTIFIKAT
    // =====================================

    router.get("/issued-certificates/:id", (req, res) => {

        db.get(
            "SELECT * FROM issued_certificates WHERE id = ?",
            [req.params.id],
            (error, row) => {

                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: error.message
                    });
                }

                if (!row) {
                    return res.status(404).json({
                        success: false,
                        message: "Sertifikat topilmadi."
                    });
                }

                res.json(row);
            }
        );

    });


    // =====================================
    // YANGI SERTIFIKAT SAQLASH
    // =====================================

    router.post("/issued-certificates", (req, res) => {

        const {
            fullname,
            course,
            duration,
            startDate,
            endDate,
            issueDate,
            certificateNo,
            description
        } = req.body;

        if (
            !fullname ||
            !course ||
            !duration ||
            !issueDate ||
            !certificateNo
        ) {
            return res.status(400).json({
                success: false,
                message: "Majburiy maydonlar to‘ldirilmagan."
            });
        }

        db.run(
            `
            INSERT INTO issued_certificates (
                fullname,
                course,
                duration,
                startDate,
                endDate,
                issueDate,
                certificateNo,
                description
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                fullname,
                course,
                duration,
                startDate,
                endDate,
                issueDate,
                certificateNo,
                description
            ],
            function (error) {

                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: error.message
                    });
                }

                res.json({
                    success: true,
                    id: this.lastID
                });
            }
        );

    });


    // =====================================
    // SERTIFIKATNI O'CHIRISH
    // =====================================

    router.delete("/issued-certificates/:id", (req, res) => {

        db.run(
            "DELETE FROM issued_certificates WHERE id = ?",
            [req.params.id],
            function (error) {

                if (error) {
                    return res.status(500).json({
                        success: false,
                        message: error.message
                    });
                }

                res.json({
                    success: true
                });
            }
        );

    });

// =====================================
// MA'LUMOTNOMANI QR ORQALI TEKSHIRISH
// =====================================

router.get("/verify-certificate/:certificateNo", (req, res) => {

    const certificateNo = req.params.certificateNo;

    db.get(
        `
        SELECT
            id,
            fullname,
            phone,
            course,
            status,
            startDate,
            endDate,
            issueDate,
            certificateNo,
            purpose
        FROM certificates
        WHERE certificateNo = ?
        `,
        [certificateNo],
        (error, row) => {

            if (error) {

                return res.status(500).json({
                    success: false,
                    valid: false,
                    message: error.message
                });

            }

            if (!row) {

                return res.status(404).json({
                    success: false,
                    valid: false,
                    message: "Ma'lumotnoma topilmadi."
                });

            }

            res.json({
                success: true,
                valid: true,
                certificate: row
            });

        }
    );

});

    // =====================================
    // DIPLOMLAR
    // =====================================

    router.get("/diplomas", (req, res) => {
        db.all("SELECT * FROM diplomas ORDER BY id DESC", [], (error, rows) => {
            if (error) return res.status(500).json({ success: false, message: error.message });
            res.json(rows);
        });
    });

    router.get("/diplomas/:id", (req, res) => {
        db.get("SELECT * FROM diplomas WHERE id = ?", [req.params.id], (error, row) => {
            if (error) return res.status(500).json({ success: false, message: error.message });
            if (!row) return res.status(404).json({ success: false, message: "Diplom topilmadi." });
            res.json(row);
        });
    });

    router.post("/diplomas", (req, res) => {
        const { fullname, course, duration, startDate, endDate, issueDate, diplomaNo, director, description } = req.body;

        if (!fullname || !course || !duration || !startDate || !endDate || !issueDate || !diplomaNo) {
            return res.status(400).json({ success: false, message: "Majburiy maydonlar to‘ldirilmagan." });
        }

        if (startDate > endDate) {
            return res.status(400).json({ success: false, message: "Tugash sanasi boshlanish sanasidan oldin bo‘lishi mumkin emas." });
        }

        db.run(
            `INSERT INTO diplomas (fullname, course, duration, startDate, endDate, issueDate, diplomaNo, director, description)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [fullname, course, duration, startDate, endDate, issueDate, diplomaNo, director, description],
            function (error) {
                if (error) return res.status(500).json({ success: false, message: error.message });
                res.json({ success: true, id: this.lastID });
            }
        );
    });

    router.delete("/diplomas/:id", (req, res) => {
        db.run("DELETE FROM diplomas WHERE id = ?", [req.params.id], function (error) {
            if (error) return res.status(500).json({ success: false, message: error.message });
            if (this.changes === 0) return res.status(404).json({ success: false, message: "Diplom topilmadi." });
            res.json({ success: true });
        });
    });

    router.get("/verify-diploma/:diplomaNo", (req, res) => {
        db.get("SELECT * FROM diplomas WHERE diplomaNo = ?", [req.params.diplomaNo], (error, row) => {
            if (error) return res.status(500).json({ success: false, valid: false, message: error.message });
            if (!row) return res.status(404).json({ success: false, valid: false, message: "Diplom topilmadi." });
            res.json({ success: true, valid: true, diploma: row });
        });
    });

    // Eng oxirida bo‘lishi shart
    return router;
};
