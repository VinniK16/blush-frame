import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Camera from "./camera.jsx";
import Preview from "./preview.jsx";
import BlushFrameWelcome from "./intro.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BlushFrameWelcome />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/preview" element={<Preview />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

