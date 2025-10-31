import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.DATA_SECRET_KEY;

export const decryptData = (encryptedString) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedString, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (err) {
    throw new Error("Invalid encrypted data");
  }
};

export const encryptData = (data) => {
   // Convert object to JSON and encrypt
   const ciphertext = CryptoJS.AES.encrypt(
     JSON.stringify(data),
     secretKey
   ).toString();
   return ciphertext;
 };