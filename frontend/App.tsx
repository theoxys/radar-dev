import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./components/ThemeProvider";
import { Header } from "./components/Header";
import { SubmissionForm } from "./components/SubmissionForm";
import { SubmissionsList } from "./components/SubmissionsList";

const queryClient = new QueryClient();

function AppInner() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="radardev-ui-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<SubmissionsList />} />
              <Route path="/submit" element={<SubmissionForm />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
