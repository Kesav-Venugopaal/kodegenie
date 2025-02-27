import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateDocstrings } from "../Services/docstringService"; 
import { Box, Typography, Card, CardContent, Stack, LinearProgress, Sheet, IconButton, Tooltip } from "@mui/joy";
import Button from "@mui/joy/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FileCopyIcon from "@mui/icons-material/FileCopy"; 
import Navbar from "./Navbar";

const CodeDocstring = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [docstrings, setDocstrings] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copySuccess, setCopySuccess] = useState(false);

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setDocstrings({});
        setError("");
        setCopySuccess(false);
    };

    const handleGenerateDocstrings = async () => {
        if (!selectedFile) {
            setError("Please upload a Python file first.");
            return;
        }

        setLoading(true);
        setDocstrings({});
        setError("");
        setCopySuccess(false);

        try {
            const docstringsData = await generateDocstrings(selectedFile); 
            setDocstrings(docstringsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        const docstringText = Object.entries(docstrings)
            .map(([functionName, docstring]) => `### ${functionName}:\n${docstring}`)
            .join("\n\n");

        navigator.clipboard.writeText(docstringText).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }).catch(() => setError("Failed to copy."));
    };

    return (
        <Box sx={{ flexGrow: 1, bgcolor: "#FFFFFF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />
            <Stack spacing={3} sx={{ width: "80%", mx: "auto", mt: 5, display: "flex", flexDirection: "row", gap: 5 }}>

                <Sheet
                    variant="outlined"
                    sx={{
                        width: "35%",
                        height: "300px", 
                        minHeight: "300px",
                        p: 2,
                        borderRadius: "md",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "#ffffff",
                        flexGrow: 0, 
                    }}
                >
                    <Button
                        component="label"
                        startDecorator={<UploadFileIcon />}
                        variant="soft"
                        color="primary"
                        sx={{ width: "100%", height: "150px", textAlign: "center" }} 
                    >
                        Upload File
                        <input type="file" hidden accept=".py" onChange={handleFileChange} />
                    </Button>

                    {selectedFile && (
                        <Typography level="body1" sx={{ fontWeight: "bold", textAlign: "center", mt: 2 }}>
                            {selectedFile.name}
                        </Typography>
                    )}

                    <Button
                        onClick={handleGenerateDocstrings}
                        color="primary"
                        size="md"
                        sx={{ width: "50%", height: "40px" }} 
                    >
                        Generate Docstrings
                    </Button>
                </Sheet>

                <Sheet
                    variant="outlined"
                    sx={{
                        width: "60%",
                        height: "350px", 
                        p: 4,
                        borderRadius: "md",
                        boxShadow: "lg",
                        bgcolor: "#ffffff",
                        overflowY: "auto", 
                        position: "relative",
                        top: "-25px"
                    }}
                >
                    {!selectedFile ? (
                        <Typography level="h6" sx={{ textAlign: "center", color: "#666", fontSize: "1.2rem" }}>
                            📂 Please upload a Python file to generate docstrings.
                        </Typography>
                    ) : loading ? (
                        <>
                            <Typography level="body1" textAlign="center">
                                Processing your file...
                            </Typography>
                            <LinearProgress />
                        </>
                    ) : Object.keys(docstrings).length > 0 ? (
                        <Card variant="outlined" sx={{ p: 3 }}>
                            <CardContent sx={{ maxHeight: "250px", overflowY: "auto", position: "relative" }}>
                                <Typography level="h4" fontWeight="bold" mb={2}>
                                    Generated Docstrings:
                                </Typography>

                                <Tooltip title="Copy to Clipboard">
                                    <IconButton
                                        onClick={handleCopy}
                                        size="sm"
                                        sx={{
                                            position: "absolute",
                                            top: 5,
                                            right: 5,
                                            zIndex: 10,
                                            color: copySuccess ? "success.main" : "neutral.main",
                                            transition: "0.3s ease",
                                        }}
                                    >
                                        <FileCopyIcon />
                                    </IconButton>
                                </Tooltip>

                                {Object.entries(docstrings).map(([functionName, docstring], index) => (
                                    <Sheet
                                        key={index}
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            bgcolor: "#f9f9f9",
                                            borderRadius: "sm",
                                            fontFamily: "monospace",
                                        }}
                                    >
                                        <Typography level="h6" fontWeight="bold">
                                            {functionName}
                                        </Typography>
                                        <Typography level="body2" whiteSpace="pre-wrap">
                                            {docstring}
                                        </Typography>
                                    </Sheet>
                                ))}
                            </CardContent>
                        </Card>
                    ) : (
                        <Typography level="h6" sx={{ textAlign: "center", color: "#666", fontSize: "1.2rem" }}>
                            No functions detected in the uploaded file.
                        </Typography>
                    )}
                </Sheet>
            </Stack>
        </Box>
    );
};

export default CodeDocstring;
