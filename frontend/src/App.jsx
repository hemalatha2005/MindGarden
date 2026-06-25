/**
 * App.jsx — MindGarden Root Component
 *
 * Sets up React Router with two routes:
 *  - "/"       → GardenView (main page)
 *  - "/focus"  → FocusView (urgent items only)
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GardenView from "./pages/GardenView";
import FocusView from "./pages/FocusView";

function App() {
  return (
    <Router>
      <Routes>
        {/* Main garden — captures all thoughts */}
        <Route path="/" element={<GardenView />} />

        {/* Focus mode — urgent & upcoming only */}
        <Route path="/focus" element={<FocusView />} />
      </Routes>
    </Router>
  );
}

export default App;
