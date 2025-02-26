import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api"; 

export const summarizeCode = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(`${BASE_URL}/summarize/`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        return response.data.summary;
    } catch (error) {
        console.error("Summarization error:", error);
        throw new Error("Failed to generate summary.");
    }
};
