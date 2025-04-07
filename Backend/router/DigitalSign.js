const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const qrcode = require('qrcode');
const router = express.Router();
const path = require('path');

const privateKeyPath = path.join(__dirname, '../privateKey.pem');
const publicKeyPath = path.join(__dirname, '../publicKey.pem');

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

// Function to sign message
function signMessage(message) {
    const sign = crypto.createSign('SHA256');
    sign.update(message);
    sign.end();
    return sign.sign(privateKey, 'base64');
}

// Function to verify signature
function verifySignature(message, signature) {
    const verify = crypto.createVerify('SHA256');
    verify.update(message);
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
}

// Function to create hash from the entire product details
function generateHash(data) {
    const sortedDataString = JSON.stringify(data, Object.keys(data).sort());
    return crypto.createHash('sha256').update(sortedDataString).digest('hex');
}

// Route to create barcode
router.post('/create-barcode', async (req, res) => {
    const productDetails = req.body;
    const timestamp = Date.now();
    productDetails.timestamp = timestamp;

    const { manufactureDate, expiryDate } = productDetails;

    // Convert dates to timestamp for comparison
    const manufactureTimestamp = new Date(manufactureDate).getTime();
    const expiryTimestamp = new Date(expiryDate).getTime();
    const currentTimestamp = Date.now();

    // Validate dates
    if (!manufactureTimestamp || !expiryTimestamp || manufactureTimestamp >= expiryTimestamp) {
        return res.status(400).json({ status: 'false', error: 'Manufacture date must be before expiry date' });
    }

    if (expiryTimestamp <= currentTimestamp) {
        return res.status(400).json({ status: 'false', error: 'Expiry date must be in the future' });
    }

    // Generate hash using full product details
    const hash = generateHash(productDetails);
    const digitalSignature = signMessage(hash);

    // Create barcode data
    const barcodeData = JSON.stringify({ ...productDetails, digitalSignature });
    const base64EncodedData = Buffer.from(barcodeData).toString('base64');

    // Generate QR code
    qrcode.toDataURL(base64EncodedData, (err, url) => {
        if (err) {
            return res.status(500).json({ status: 'false', error: 'Failed to generate QR code' });
        }
        res.json({ status: 'true', qrCode: url, base64EncodedData });
    });
});

// Route to verify barcode
router.post('/verify-barcode', (req, res) => {
    const { base64EncodedData } = req.body;
    console.log("Received ds : ",base64EncodedData);
    try {
        const decodedData = Buffer.from(base64EncodedData, 'base64').toString('utf8');
        const { digitalSignature, ...productDetails } = JSON.parse(decodedData);

        // Generate hash from full product details
        const hash = generateHash(productDetails);

        // Verify signature
        const isValid = verifySignature(hash, digitalSignature);
        console.log(isValid);
        if (isValid) {
            return res.json({ status: 'success', message: 'Signature is valid!', productDetails });
        } else {
            return res.json({ status: 'error', message: 'Signature is invalid!' });
        }
    } catch (error) {
        return res.status(400).json({ status: 'error', message: 'Invalid barcode data' });
    }
});

module.exports = router;
