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
import Reports from "./pages/Reports";
import Users from "./pages/Users";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/projects/:id"} component={ProjectDetails} />
      <Route path={"/projects"} component={Projects} />
      <Route path={"/sales"} component={SalesCollections} />
      <Route path={"/transactions"} component={Finance} />
      <Route path={"/approvals"} component={Approvals} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/users"} component={Users} />
      <Route path={"/settings"} component={Home} />
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
