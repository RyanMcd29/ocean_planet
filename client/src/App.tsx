import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HomePage from "@/pages/Home";
import DiveSitePage from "@/pages/DiveSitePage";
import SpeciesPage from "@/pages/SpeciesPage";
import ProfilePage from "@/pages/ProfilePage";
import LearnPage from "@/pages/LearnPage";
import LessonDetailPage from "@/pages/LessonDetailPage";
import QuizPage from "@/pages/QuizPage";
import CommunityPage from "@/pages/CommunityPage";

import MobileNav from "@/components/layout/MobileNav";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/dive-site/:id" component={DiveSitePage} />
        <Route path="/species/:id" component={SpeciesPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/community" component={CommunityPage} />
        <Route path="/learn" component={LearnPage} />
        <Route path="/learn/lesson/:id" component={LessonDetailPage} />
        <Route path="/learn/quiz/:id" component={QuizPage} />

        <Route component={NotFound} />
      </Switch>
      <Footer />
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {/* Wrap the Router with our LearningPromptProvider */}
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
