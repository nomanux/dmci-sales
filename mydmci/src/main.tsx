import * as React from "react";
import * as ReactDOM from "react-dom/client";
// Same theme as dmci-sales: shared Tailwind config, base CSS and components.
import "@/tailwind.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
