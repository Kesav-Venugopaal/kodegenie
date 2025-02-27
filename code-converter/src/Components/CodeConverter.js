import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Sheet, Typography, Button, Input, Card, LinearProgress, IconButton } from "@mui/joy";
import { Download, ThumbUp, ThumbDown } from "@mui/icons-material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Navbar from "./Navbar";
import { convertCode } from "../Services/convertService"; 

const CodeConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [instruction, setInstruction] = useState("");
  const [convertedCode, setConvertedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showLoadingBox, setShowLoadingBox] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError("");
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }
    if (!instruction) {
      setError("Please enter a conversion instruction (e.g., 'C++', 'PySpark').");
      return;
    }

    setError("");
    setFeedback("");
    setConvertedCode("");
    setShowLoadingBox(true);
    setLoading(true);

    try {
      const convertedText = await convertCode(selectedFile, instruction); 
      setConvertedCode(convertedText);
    } catch (err) {
      setError("Conversion failed.");
    }

    setLoading(false);
  };

  const handleThumbsDown = () => {
    setFeedback("");
    handleConvert();
  };

  const handleThumbsUp = () => {
    setFeedback("✅ Thank you for your feedback!");
  };

  const handleDownload = () => {
    const blob = new Blob([convertedCode], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "converted_code.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      <Navbar />
      <Stack direction="row" spacing={5} sx={{ p: "5%", justifyContent: "center" }}>

        <Sheet variant="soft" sx={{ width: "40%", p: 4, borderRadius: "md", boxShadow: "lg", bgcolor: "#ffffff" }}>
          <Typography level="h3" fontWeight="bold" sx={{ mb: 3 }}>
            Code Converter
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

          <Input placeholder="Enter conversion language (e.g., C++, PySpark)" value={instruction} onChange={(e) => setInstruction(e.target.value)} sx={{ width: "100%", mt: 3, fontSize: "1rem", bgcolor: "#f7f7f7", borderRadius: "sm" }} />

          <Button variant="soft" color="primary" onClick={handleConvert} sx={{ mt: 3, fontSize: "1rem", width: "25%", height: "10%", p: 2 }}>
            Convert
          </Button>

          {error && <Typography color="danger" sx={{ mt: 2, textAlign: "center" }}>{error}</Typography>}
        </Sheet>

        <Sheet variant="outlined" sx={{ width: "60%", p: 4, borderRadius: "md", boxShadow: "lg", bgcolor: "#ffffff" }}>
          {!showLoadingBox ? (
            <Typography level="h4" sx={{ textAlign: "center", color: "#666" }}>
              📂 Please upload a file to get the converted code.
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
                    Converted Code:
                  </Typography>
                  <Card variant="outlined" sx={{ p: 2, bgcolor: "#f9f9f9", maxHeight: 300, overflow: "auto", fontSize: "1rem", fontFamily: "monospace" }}>
                    {convertedCode}
                  </Card>

                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
                    <Stack direction="row" spacing={2}>
                      <IconButton color="success" onClick={handleThumbsUp}>
                        <ThumbUp />
                      </IconButton>
                      <IconButton color="danger" onClick={handleThumbsDown}>
                        <ThumbDown />
                      </IconButton>
                    </Stack>
                    <Button variant="outlined" startDecorator={<Download />} onClick={handleDownload}>
                      Download
                    </Button>
                  </Stack>

                  {feedback && <Typography color="success" sx={{ mt: 2, textAlign: "center" }}>{feedback}</Typography>}
                </Box>
              )}
            </Box>
          )}
        </Sheet>
      </Stack>
    </Box>
  );
};

export default CodeConverter;
