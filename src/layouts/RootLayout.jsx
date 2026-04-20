import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { paths } from "../utils/paths";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const HomePage = lazy(() => import("../pages/home/HomePage"));
const ReportsPage = lazy(() => import("../pages/reports/ReportsPage"));
const ToolsPage = lazy(() => import("../pages/tools/ToolsPage"));
const DescriptionsPage = lazy(() =>
  import("../pages/descriptions/DescriptionsPage")
);
const PaperPage = lazy(() => import("../pages/paper/PaperPage"));
const BugPage = lazy(() => import("../pages/bug/BugPage"));
const ReportViewerPage = lazy(() =>
  import("../pages/reports/ReportViewerPage")
);

function RootLayout() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.reports} element={<ReportsPage />} />
        <Route path={paths.reportDetail} element={<ReportViewerPage />} />
        <Route path={paths.descriptions} element={<DescriptionsPage />} />
        <Route path={paths.paper} element={<PaperPage />} />
        <Route path={paths.tools} element={<ToolsPage />} />
        <Route path={paths.bugDetail} element={<BugPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default RootLayout;
