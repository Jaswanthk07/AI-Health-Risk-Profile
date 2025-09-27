import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeDatabaseService } from "./services/riskAnalysis";
import { BackendDatabaseService } from "./services/backendDatabaseService";

// Initialize backend database service so all analysis calls go through the API
initializeDatabaseService(new BackendDatabaseService());

createRoot(document.getElementById("root")!).render(<App />);
