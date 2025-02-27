import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api"; 

export const generateDocstrings = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(`${BASE_URL}/generate-docstring/`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        return response.data.docstrings;
    } catch (error) {
        console.error("Docstring generation error:", error);
        throw new Error("Failed to generate docstrings.");
    }
};
