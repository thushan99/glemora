import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import VirtualTryOn from "./pages/VirtualTryOn";


function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/virtual-try-on" element={<VirtualTryOn />} />
        </Routes>
    );
}

export default App;

