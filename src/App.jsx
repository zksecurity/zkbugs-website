import { ThemeProvider } from "@emotion/react";
import RootLayout from "./layouts/RootLayout";

function App() {
  return (
    <ThemeProvider theme={{}}>
      <RootLayout />
    </ThemeProvider>
  );
}

export default App;
