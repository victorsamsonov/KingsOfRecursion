import { createContext, useState } from "react";

const PlaylistObjectContext = createContext();

export function ObjectProvider({ children }) {
  const [contextValue, setContextValue] = useState({});

  const updateContextValue = (newValue) => {
    setContextValue(newValue);
  };

  return (
    <PlaylistObjectContext.Provider
      value={{ contextValue, updateContextValue }}
    >
      {children}
    </PlaylistObjectContext.Provider>
  );
}

export default PlaylistObjectContext;
