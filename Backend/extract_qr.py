import sys
import cv2
import numpy as np
import base64
import json

def decode_qr(image):
    detector = cv2.QRCodeDetector()
    data, _, _ = detector.detectAndDecode(image)
    return data

def process_base64_image(base64_str):
    img_data = base64.b64decode(base64_str)
    np_arr = np.frombuffer(img_data, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    qr_data = decode_qr(image)
    
    return {"qrData": qr_data} if qr_data else {"error": "No QR code detected"}

if __name__ == "__main__":
    base64_str = sys.argv[1]
    result = process_base64_image(base64_str)
    print(json.dumps(result))
