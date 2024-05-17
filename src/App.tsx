import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";

import "./App.css";
import useIsSmallScreen from "./components/hooks/useIsSmallScreen";

function App() {
  const isSmallScreen = useIsSmallScreen();

  return (
    <div className="App">
      {!isSmallScreen && <div className="navbar">
        <Sidebar />
      </div>}
      <div className="student-list">
        <Header />

        <Main />
      </div>
    </div>
  );
}

export default App;
