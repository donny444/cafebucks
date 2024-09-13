const express = require("express");
const router = express.Router();
const Staff = require("../models/staff_model");

router.post("/", (req, res) => {
    const rfidData = req.body.rfidData;
    const timestamp = new Date();

    if (!rfidData) {
        return res.status(400).json({ success: false, message: "RFID data is required" });
    }

    console.log("Received RFID Data: ", rfidData, "at", timestamp);

    res.json({ success: true, message: "RFID data received successfully", data: { rfid: rfidData, timestamp } });
});

router.post("/check-rfid", async (req, res) => {
    try {
        const { rfid } = req.body;

        const sanitizedRfid = rfid.trim();

        if (sanitizedRfid === "") {
            return res.status(400).json({ message: "RFID is required" });
        }

        if (sanitizedRfid.length !== 8) {
            return res.status(400).json({ message: "RFID must be 8 characters long" });
        }

        const staff = await Staff.findOne({ where: { rfid } });

        if (staff) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error("Error checking RFID:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
