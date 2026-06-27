import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import GardenView from "./pages/GardenView";
import FocusView from "./pages/FocusView";
import Sidebar from "./components/Sidebar";
import AuthGate from "./components/AuthGate";

function App() {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <AuthGate>
      {({ onSignOut }) => (
        <Router>
          <div className="flex w-full min-h-screen bg-garden-bg">
            <Sidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} onSignOut={onSignOut} />
            <div className="flex-1 flex min-w-0">
              <Routes>
                <Route path="/" element={<GardenView activeFilter={activeFilter} />} />
                <Route path="/focus" element={<FocusView />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </Router>
      )}
    </AuthGate>
  );
}

export default App;
