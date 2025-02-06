/* eslint-disable no-unused-vars */
import { createContext, useContext } from "react";

export const MyThemeContext = createContext({
  mode: "dark",
  setMode: (_mode) => {},
  isDarkMode: true,
  setIsDarkMode: (_isDarkMode) => {},
});

const useMyThemeProvider = () => {
  const context = useContext(MyThemeContext);
  if (!context) {
    throw new Error("useMyThemeProvider must be used within MyThemeProvider");
  }
  return context;
};

export { useMyThemeProvider };
