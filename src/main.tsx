import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./tailwind.css";
import "./disabled-row.css";
import App from "./App";
import ComponentsPage from "./ComponentsPage";

// Standalone URL routes that bypass the dashboard shell entirely — checked
// against the real browser path (not the in-app NavigationContext, which
// only tracks screens within the dashboard). Add more paths here the same
// way if other pages need a direct, bookmarkable URL.
const path = window.location.pathname.replace(/\/+$/, "") || "/";
console.log("path", path);
function Root() {
  if (path === "/component") return <ComponentsPage />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
