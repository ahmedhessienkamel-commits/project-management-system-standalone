import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Finance from "./pages/Finance";
import Approvals from "./pages/Approvals";
import ProjectDetails from "./pages/ProjectDetails";
import SalesCollections from "./pages/SalesCollections";
import Reports from "@/pages/Reports";
import Accounting from "@/pages/Accounting";
import Users from "@/pages/Users";
import DataQuality from "@/pages/DataQuality";
import Employees from "@/pages/Employees";
import Operations from "@/pages/Operations";
import LegacyImport from "./pages/LegacyImport";
import Tasks from "./pages/Tasks";
import CompanySettings from "./pages/CompanySettings";
import BanksCash from "./pages/BanksCash";
import StandaloneFinancialReport from "./pages/StandaloneFinancialReport";
import Inventory from "./pages/Inventory";
import MyRequests from "./pages/MyRequests";
import PasswordAuth from "./pages/PasswordAuth";

function Landing() {
  const legacyToken = new URLSearchParams(window.location.search).get("invite");
  return legacyToken ? <PasswordAuth invitation /> : <Home />;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/login"} component={() => <PasswordAuth />} />
      <Route path={"/accept-invitation"} component={() => <PasswordAuth invitation />} />
      <Route path={"/"} component={Landing} />
      <Route path={"/company-settings"} component={CompanySettings} />
      <Route path={"/banks-cash"} component={BanksCash} />
      <Route path={"/indicators"} component={Reports} />
      <Route path={"/projects/:id"} component={ProjectDetails} />
      <Route path={"/projects"} component={Projects} />
      <Route path={"/sales"} component={SalesCollections} />
      <Route path={"/transactions"} component={Accounting} />
      <Route path={"/expenses"} component={Finance} />
      <Route path={"/finance"} component={Finance} />
      <Route path={"/accounting"} component={Accounting} />
      <Route path={"/accounting-documents"} component={Accounting} />
      <Route path={"/accounting-settings"} component={Accounting} />
      <Route path={"/accounting-reports"} component={Accounting} />
      <Route path={"/payroll"} component={Finance} />
      <Route path={"/operations"} component={Operations} />
      <Route path={"/inventory"} component={Inventory} />
      <Route path={"/certificates"} component={Operations} />
      <Route path={"/attendance"} component={Operations} />
      <Route path={"/custody"} component={Operations} />
      <Route path={"/tasks"} component={Tasks} />
      <Route path={"/my-requests"} component={MyRequests} />
      <Route path={"/approvals"} component={Approvals} />
      <Route path={"/supplier-statements"} component={StandaloneFinancialReport} />
      <Route path={"/cost-center"} component={StandaloneFinancialReport} />
      <Route path={"/income-statement"} component={StandaloneFinancialReport} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/users"} component={Users} />
      <Route path={"/data-quality"} component={DataQuality} />
      <Route path={"/employees"} component={Employees} />
      <Route path={"/settings"} component={LegacyImport} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
