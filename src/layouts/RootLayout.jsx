import { lazy } from "react";
import { Route, Routes } from "react-router";
import Header from "../components/header/Header";
import { paths } from "../utils/paths";
import Footer from "../components/footer/Footer";

const HomePage = lazy(() => import("../pages/home/HomePage"));
const ToolsPage = lazy(() => import("../pages/tools/ToolsPage"));

function RootLayout() {
  return (
    <>
      <Header />
      <Routes>
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.expertise} element={<ToolsPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default RootLayout;
