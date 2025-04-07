const express = require("express");
const crypto = require("crypto");
const { exec } = require("child_process");
const fs = require('fs');
const qrcode = require('qrcode');
const path = require('path');
const router = express.Router();

const privateKeyPath = path.join(__dirname, '../privateKey.pem');
const publicKeyPath = path.join(__dirname, '../publicKey.pem');

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

router.get("/scan-camera", (req, res) => {
    console.log("Starting the camera call");

    exec("python scan_qr.py", (error, stdout, stderr) => {
        if (error) {
            console.error("Error scanning QR:", stderr);
            return res.status(500).json({ error: "Failed to scan QR code", details: stderr });
        }

        try {
            const qrDataObj = JSON.parse(stdout);
            const base64EncodedData = qrDataObj.qrData;

            console.log("Received QR Data:", base64EncodedData);

            const decodedData = Buffer.from(base64EncodedData, "base64").toString("utf8");
            const parsedData = JSON.parse(decodedData);

            if (!parsedData.digitalSignature) {
                return res.status(400).json({ status: "error", message: "Digital signature missing in QR data" });
            }

            const { digitalSignature, ...productDetails } = parsedData;
            console.log("Decoded data:", productDetails);
            console.log("DigitalSignature:", digitalSignature);
            
            const hash = generateHash(productDetails);

            const isValid = verifySignature(hash, digitalSignature);
            console.log("Signature Verification Result:", isValid);

            if (isValid) {
                return res.json({ status: "success", message: "Signature is valid!", productDetails });
            } else {
                return res.status(400).json({ status: "error", message: "Signature is invalid!" });
            }
        } catch (parseError) {
            console.error("Error parsing QR data:", parseError);
            return res.status(400).json({ status: "error", message: "Invalid barcode data" });
        }
    });
});

function verifySignature(message, signature) {
    try {
        const verify = crypto.createVerify("SHA256");
        verify.update(message);
        verify.end();
        return verify.verify(publicKey, signature, "base64");
    } catch (err) {
        console.error("Error verifying signature:", err);
        return false;
    }
}

function generateHash(data) {
    const sortedDataString = JSON.stringify(data, Object.keys(data).sort());
    return crypto.createHash("sha256").update(sortedDataString).digest("hex");
}

module.exports = router;