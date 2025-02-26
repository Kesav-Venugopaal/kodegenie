import './App.css';
import CodeConverter from './Components/CodeConverter';
import HomeScreen from "./Components/HomeScreen";
import CodeSummarizer from './Components/CodeSummarizer';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CodeDocstring from './Components/CodeDocstring';


function App() {
  return (
    <Router>
    <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/codeconverter" element={<CodeConverter />} />
        <Route path="/summarizer" element={<CodeSummarizer />} />
        <Route path="/docstring" element={<CodeDocstring />} />


    </Routes>
</Router>
      );
}

export default App;
