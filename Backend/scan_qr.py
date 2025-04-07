import cv2
import json

def scan_camera():
    cap = cv2.VideoCapture(0)  
    detector = cv2.QRCodeDetector()

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        data, _, _ = detector.detectAndDecode(frame)
   
        cv2.imshow("QR Code Scanner", frame)

        if data:
            print(json.dumps({"qrData": data})) 
            break  

       
        if cv2.waitKey(1) & 0xFF == ord('q'):
            print(json.dumps({"error": "User exited camera"}))
            break

    cap.release()
    cv2.destroyAllWindows() 

if __name__ == "__main__":
    scan_camera()
