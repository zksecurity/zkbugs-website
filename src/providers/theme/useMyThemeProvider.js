import { createContext, useContext } from "react";

export const MyThemeContext = createContext({});

const useMyThemeProvider = () => {
  const context = useContext(MyThemeContext);
  if (!context) {
    throw new Error("useMyThemeProvider must be used within MyThemeProvider");
  }
  return context;
};

export { useMyThemeProvider };
