import { createContext, useState } from "react";

const PlaylistObjectContext = createContext();
const NotesObjectContext = createContext();
const UserPreferanceContext = createContext();
export function ObjectProvider({ children }) {
  const [contextValue, setContextValue] = useState({});
  const [notesContextValue, setNotesContextValue] = useState({});
  const [userPreferance, setUserPreferance] = useState("");
  

  const updateContextValue = (newValue) => {
    setContextValue(newValue);
  };

  return (
    <PlaylistObjectContext.Provider
      value={{ contextValue, updateContextValue }}
    >
      <NotesObjectContext.Provider
        value={{ notesContextValue, setNotesContextValue }}
      >
        <UserPreferanceContext.Provider
          value={{ userPreferance, setUserPreferance }}
        >
          {children}
        </UserPreferanceContext.Provider>
      </NotesObjectContext.Provider>
    </PlaylistObjectContext.Provider>
  );
}

export { PlaylistObjectContext, NotesObjectContext, UserPreferanceContext };
