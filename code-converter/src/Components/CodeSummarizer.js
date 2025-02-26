import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { summarizeCode } from "../Services/summarizeService"; 
import { Box, Stack, Sheet, Typography, Button, LinearProgress, Card } from "@mui/joy";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const CodeSummarizer = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showLoadingBox, setShowLoadingBox] = useState(false);

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setError("");
        setSummary("");
    };

    const handleSummarize = async () => {
        if (!selectedFile) {
            setError("Please upload a code file before summarizing.");
            return;
        }
        setError("");
        setSummary("");
        setLoading(true);
        setShowLoadingBox(true);

        try {
            const summaryText = await summarizeCode(selectedFile); 
            setSummary(summaryText);
        } catch (error) {
            setError(error.message);
        }

        setLoading(false);
    };

    return (
        <Box sx={{ bgcolor: "#f9f9f9", minHeight: "100vh" }}>
            <Navbar />

            <Stack direction="row" spacing={5} sx={{ p: "5%", justifyContent: "center" }}>
                <Sheet variant="soft" sx={{ width: "40%", p: 4, borderRadius: "md", boxShadow: "lg", bgcolor: "#ffffff" }}>
                    <Typography level="h3" fontWeight="bold" sx={{ mb: 3 }}>
                        Code Summarizer
                    </Typography>

                    <Card variant="outlined" sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "md", cursor: "pointer", transition: "0.3s", "&:hover": { boxShadow: "lg", transform: "scale(1.03)" } }}>
                        <Button component="label" startDecorator={<UploadFileIcon />} sx={{ fontSize: "1rem", p: "10px 16px" }}>
                            Upload File
                            <input type="file" hidden onChange={handleFileChange} accept=".txt,.py,.js,.java,.cpp" />
                        </Button>
                    </Card>

                    {selectedFile && (
                        <Typography level="body-md" sx={{ mt: 2, fontWeight: "bold", textAlign: "center", color: "#333" }}>
                            {selectedFile.name}
                        </Typography>
                    )}

                    <Button variant="soft"
                        color="primary" onClick={handleSummarize} sx={{ mt: 3, fontSize: "1rem", width: "38%", height: "20%", p: 2 }}>
                        Summarize Code
                    </Button>

                    {error && <Typography color="danger" sx={{ mt: 2, textAlign: "center" }}>{error}</Typography>}
                </Sheet>

                <Sheet variant="outlined" sx={{ width: "60%", p: 4, borderRadius: "md", boxShadow: "lg", bgcolor: "#ffffff" }}>
                    {!showLoadingBox ? (
                        <Typography level="h4" sx={{ textAlign: "center", color: "#666" }}>
                            📂 Please upload a file to get the summary.
                        </Typography>
                    ) : (
                        <Box>
                            {loading ? (
                                <>
                                    <Typography level="body-md" sx={{ textAlign: "center" }}>Processing your file...</Typography>
                                    <LinearProgress sx={{ mt: 2 }} />
                                </>
                            ) : (
                                <Box>
                                    <Typography level="h5" sx={{ mb: 2 }}>
                                        Code Summary:
                                    </Typography>
                                    <Card variant="outlined" sx={{ p: 2, bgcolor: "#f9f9f9", maxHeight: 300, overflow: "auto", fontSize: "1rem", fontFamily: "monospace" }}>
                                        {summary}
                                    </Card>
                                </Box>
                            )}
                        </Box>
                    )}
                </Sheet>
            </Stack>
        </Box>
    );
};

export default CodeSummarizer;
