import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  //멱등성
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
