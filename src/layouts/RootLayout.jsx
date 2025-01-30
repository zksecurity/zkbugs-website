import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { paths } from "../utils/paths";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const HomePage = lazy(() => import("../pages/home/HomePage"));
const ToolsPage = lazy(() => import("../pages/tools/ToolsPage"));
const DescriptionsPage = lazy(() =>
  import("../pages/descriptions/DescriptionsPage")
);

function RootLayout() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.tools} element={<ToolsPage />} />
        <Route path={paths.descriptions} element={<DescriptionsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default RootLayout;
