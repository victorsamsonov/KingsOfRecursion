import React, { useState, useEffect, createContext } from "react";
import Preloader from "../src/components/Pre";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import Setup from "./components/Setup/Setup";
import PlaylistPage from "./components/Projects/Playlist";
import AddPlaylist from "./components/Setup/AddPlaylist";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useHistory
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ObjectProvider } from "./PlaylistContext";

function App() {
  const [load, upadateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);
  const PlaylistObjectContext = createContext();

  const [contextValue, setContextValue] = useState({});

  const updateContextValue = (newValue) => {
    setContextValue(newValue);
  };

  return (
    <>
      <Router>
        <Preloader load={load} />
        <ObjectProvider>
          <div className="App" id={load ? "no-scroll" : "scroll"}>
            <Navbar />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/playlist" element={<PlaylistPage />} />
              <Route path="/setup" element={<Setup/>} />
              <Route path="/addplaylist" element={<AddPlaylist />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </ObjectProvider>
      </Router>
    </>
  );
}

export default App;
