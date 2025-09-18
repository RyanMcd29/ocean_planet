import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import HomePage from "@/pages/Home";
import DiveSitePage from "@/pages/DiveSitePage";
import SpeciesPage from "@/pages/SpeciesPage";
import ProfilePage from "@/pages/ProfilePage";
import NewEditProfilePage from "@/pages/NewEditProfilePage";
import LearnPage from "@/pages/LearnPage";
import LessonDetailPage from "@/pages/LessonDetailPage";
import QuizPage from "@/pages/QuizPage";
import CommunityPage from "@/pages/CommunityPage";
import LogDivePage from "@/pages/LogDivePage";
import EditDivePage from "@/pages/EditDivePage";
import SpeciesBrowsePage from "@/pages/SpeciesBrowsePage";
import MissionPage from "@/pages/MissionPage";
import BottomTrawlingLessonPage from "@/pages/BottomTrawlingLessonPage";
import MicroLessonsPage from "@/pages/MicroLessonsPage";
import SignupPage from "@/pages/SignupPage";
import LoginPage from "@/pages/LoginPage";
import ContactPage from "@/pages/ContactPage";

import MobileNav from "@/components/layout/MobileNav";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/dive-site/:id" component={DiveSitePage} />
        <Route path="/species" component={SpeciesBrowsePage} />
        <Route path="/species/:id" component={SpeciesPage} />
        <Route path="/profile">
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        </Route>
        <Route path="/profile/edit">
          <ProtectedRoute>
            <NewEditProfilePage />
          </ProtectedRoute>
        </Route>
        <Route path="/community" component={CommunityPage} />
        <Route path="/log-dive">
          <ProtectedRoute>
            <LogDivePage />
          </ProtectedRoute>
        </Route>
        <Route path="/edit-dive/:id">
          <ProtectedRoute>
            <EditDivePage />
          </ProtectedRoute>
        </Route>
        <Route path="/learn">
          <ProtectedRoute>
            <LearnPage />
          </ProtectedRoute>
        </Route>
        <Route path="/learn/lesson/:id" component={LessonDetailPage} />
        <Route path="/learn/quiz/:id" component={QuizPage} />
        <Route path="/mission" component={MissionPage} />
        <Route path="/micro-lessons" component={MicroLessonsPage} />
        <Route path="/lessons/bottom-trawling" component={BottomTrawlingLessonPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/contact" component={ContactPage} />

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
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
