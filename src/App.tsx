import { Suspense } from "react";

import { BrowserRouter, useRoutes } from "react-router-dom";
import "./App.css";
import NavigationPopup from "./components/navigation/NavigationPopup";
import { routes } from "./routes";

function AppRoutes() {
  return useRoutes(routes);
}

export function App() {
  return (
    <BrowserRouter>
      <NavigationPopup />
      <Suspense
        fallback={
          <div style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
            LOADING...
          </div>
        }
      >
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
