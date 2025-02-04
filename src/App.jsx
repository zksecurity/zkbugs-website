import RootLayout from "./layouts/RootLayout";
import MyThemeProvider from "./providers/MyThemeProvider";

function App() {
  return (
    <MyThemeProvider>
      <RootLayout />
    </MyThemeProvider>
  );
}

export default App;
