import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import HomePage from "./components/HomePage";
import Loading from "./components/Loading";
import SkeletonLoader from "./components/SkeletonLoader";
import { AppProvider } from "./context/AppContext";
import { queryClient } from "./lib/queryClient";
import "./app.css"; // Import global styles

// Lazy load components for code splitting
const ResumeBuilder = lazy(() => import("./components/ResumeBuilder"));
const ResumePreview = lazy(() => import("./components/ResumePreview"));

// Preload functions for better UX
export const preloadResumeBuilder = () => {
  import("./components/ResumeBuilder");
};

export const preloadResumePreview = () => {
  import("./components/ResumePreview");
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/builder" 
              element={
                <Suspense fallback={<SkeletonLoader type="resume-builder" />}>
                  <ResumeBuilder />
                </Suspense>
              } 
            />
            <Route 
              path="/preview" 
              element={
                <Suspense fallback={<SkeletonLoader type="resume-preview" />}>
                  <ResumePreview />
                </Suspense>
              } 
            />
          </Routes>
        </Router>
      </AppProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
