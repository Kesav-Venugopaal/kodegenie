import React from "react";
import { AppBar, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Card, CardContent, CardOverflow, Typography, Grid } from '@mui/joy';
import logo from "../Assets/logo.jpg";
import codeConversionImg from "../Assets/code_conversion.jpg";
import docSummarizationImg from "../Assets/doc_summarization.jpg";
import documentationImg from "../Assets/documentation.jpg";

const HomeScreen = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ flexGrow: 1, height: "100vh", bgcolor: "#f5f5f5" }}>
            <AppBar
                position="static"
                sx={{
                    background: "linear-gradient(135deg,rgb(219, 227, 233),rgb(159, 176, 199))", 
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    borderBottom: "4px  #42a5f5",
                    position: "relative",
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "4px",
                        background: "linear-gradient(90deg, rgba(66,165,245,0.8), rgba(144,202,249,0.8))", 
                        boxShadow: "0px 0px 12px rgba(66,165,245,0.8)",
                        animation: "glow 1.5s infinite alternate",
                    },
                    "@keyframes glow": {
                        "0%": { boxShadow: "0px 0px 6px rgba(66,165,245,0.6)" },
                        "100%": { boxShadow: "0px 0px 12px rgba(66,165,245,0.9)" }
                    }
                }}
            >
                <Toolbar>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ height: 40, marginRight: 15, filter: "drop-shadow(2px 2px 5px rgba(0,0,0,0.2))" }}
                    />

                    <Typography
                        variant="h5"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            fontWeight: "600",
                            fontFamily: "'Poppins', sans-serif",
                            letterSpacing: "1px",
                            color: "#333",
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        AIBuddy
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "85vh" }}>
                <Stack spacing={3} sx={{ width: "80%" }}>
                    <Grid container spacing={5} justifyContent="center">

                        <Grid xs={12} sm={4}>
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: "15px",
                                    boxShadow: "lg",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    "&:hover": { transform: "scale(1.05)", transition: "0.3s ease-in-out" }
                                }}
                                onClick={() => navigate("/codeconverter")}
                            >
                                <CardOverflow sx={{ height: "200px", overflow: "hidden" }}>
                                    <img
                                        src={codeConversionImg}
                                        alt="Code Conversion"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </CardOverflow>
                                <CardContent>
                                    <Typography level="h4" fontWeight="bold">Code Conversion</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid xs={12} sm={4}>
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: "15px",
                                    boxShadow: "lg",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    "&:hover": { transform: "scale(1.05)", transition: "0.3s ease-in-out" }
                                }}
                                onClick={() => navigate("/summarizer")}
                            >
                                <CardOverflow sx={{ height: "200px", overflow: "hidden" }}>
                                    <img
                                        src={docSummarizationImg}
                                        alt="Code Summarization"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </CardOverflow>
                                <CardContent>
                                    <Typography level="h4" fontWeight="bold">Code Summarization</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid xs={12} sm={4}>
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: "15px",
                                    boxShadow: "lg",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    "&:hover": { transform: "scale(1.05)", transition: "0.3s ease-in-out" }
                                }}
                                onClick={() => navigate("/docstring")}
                            >
                                <CardOverflow sx={{ height: "200px", overflow: "hidden" }}>
                                    <img
                                        src={documentationImg}
                                        alt="Code Documentation"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </CardOverflow>
                                <CardContent>
                                    <Typography level="h4" fontWeight="bold">Code Documentation</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                    </Grid>
                </Stack>
            </Box>
        </Box>
    );
};

export default HomeScreen;
