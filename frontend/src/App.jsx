/**
 * App.jsx — MindGarden Root Component
 */

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./components/SettingsContext";
import GardenView from "./pages/GardenView";
import FocusView from "./pages/FocusView";
import SettingsView from "./pages/SettingsView";
import Sidebar from "./components/Sidebar";

function App() {
  // Lift activeFilter state up so Sidebar can control GardenView
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <SettingsProvider>
      <Router>
        <div className="flex w-full min-h-screen bg-white">
          {/* Left Sidebar */}
          <Sidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          {/* Main Routing Area */}
          <div className="flex-1 flex min-w-0">
            <Routes>
              <Route path="/" element={<GardenView activeFilter={activeFilter} />} />
              <Route path="/focus" element={<FocusView />} />
              <Route path="/settings" element={<SettingsView />} />
            </Routes>
          </div>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;
