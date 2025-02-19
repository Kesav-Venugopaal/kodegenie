import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Paper, CircularProgress, Box, IconButton } from '@mui/material';
import { FileUpload, Download, ThumbUp, ThumbDown } from '@mui/icons-material';

const UploadConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [instruction, setInstruction] = useState('');
  const [convertedCode, setConvertedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setError('Please select a file.');
      return;
    }
    if (!instruction) {
      setError("Please enter a conversion instruction (e.g., 'C++', 'PySpark').");
      return;
    }
    setError('');
    setFeedback('');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('instruction', instruction);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/convert/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setConvertedCode(response.data.converted_code);
    } catch (err) {
      setError('Conversion failed.');
    }
    setLoading(false);
  };

  const handleThumbsDown = () => {
    setFeedback('');
    handleConvert();
  };

  const handleThumbsUp = () => {
    setFeedback('Thank you for your feedback!');
  };

  const handleDownload = () => {
    const blob = new Blob([convertedCode], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'converted_code.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, margin: '2rem auto', borderRadius: 3 }}>
      <Typography variant="h4" gutterBottom>
        Code Converter
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button variant="contained" component="label" startIcon={<FileUpload />}>
          Upload File
          <input type="file" hidden onChange={handleFileChange} accept=".txt,.py,.js,.java,.cpp" />
        </Button>
        {selectedFile && <Typography variant="body1">{selectedFile.name}</Typography>}
      </Box>

      <TextField
        label="Conversion Instruction (e.g., C++, PySpark)"
        variant="outlined"
        fullWidth
        value={instruction}
        onChange={(e) => {
          setInstruction(e.target.value);
          setFeedback('');
          setConvertedCode('');
        }}
        sx={{ mb: 3 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleConvert}
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : 'Convert'}
      </Button>

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

      {convertedCode && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Converted Code:</Typography>
          <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f9f9f9', maxHeight: 300, overflow: 'auto' }}>
            <Typography component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
              {convertedCode}
            </Typography>
          </Paper>

          <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
            <Box>
              <IconButton color="success" onClick={handleThumbsUp}>
                <ThumbUp />
              </IconButton>
              <IconButton color="error" onClick={handleThumbsDown}>
                <ThumbDown />
              </IconButton>
            </Box>

            <Button variant="outlined" startIcon={<Download />} onClick={handleDownload}>
              Download
            </Button>
          </Box>
        </Box>
      )}

      {feedback && <Typography color="success.main" sx={{ mt: 2 }}>{feedback}</Typography>}
    </Paper>
  );
};

export default UploadConverter;
