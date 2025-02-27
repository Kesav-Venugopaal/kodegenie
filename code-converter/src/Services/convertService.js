import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api"; 

export const convertCode = async (file, instruction) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("instruction", instruction);

        const response = await axios.post(`${BASE_URL}/convert/`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        return response.data.converted_code;
    } catch (error) {
        console.error("Conversion error:", error);
        throw new Error("Failed to convert code.");
    }
};
