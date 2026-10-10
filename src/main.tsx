import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "./styles/App.css";
import "./styles/Details.css";
import FilmPortfolio from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FilmPortfolio />
  </StrictMode>
);