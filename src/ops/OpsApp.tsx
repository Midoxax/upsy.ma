import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import OpsLanding from "./pages/Landing";
import OpsLayout from "./OpsLayout";
import "./ops-theme.css";

const Command = lazy(() => import("./pages/Command"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const NewEvent = lazy(() => import("./pages/NewEvent"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Director = lazy(() => import("./pages/Director"));
const Preview = lazy(() => import("./pages/Preview"));

const Fallback = () => (
  <div className="p-10 text-white/40 ops-mono text-xs">LOADING…</div>
);

export const OpsApp = () => (
  <Suspense fallback={<Fallback />}>
    <Routes>
      <Route index element={<OpsLanding />} />
      <Route path="preview" element={<Preview />} />
      <Route path=":workspace" element={<ProtectedRoute><OpsLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="command" replace />} />
        <Route path="command" element={<Command />} />
        <Route path="events" element={<Events />} />
        <Route path="events/new" element={<NewEvent />} />
        <Route path="events/:eventId" element={<EventDetail />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="director" element={<Director />} />
      </Route>
    </Routes>
  </Suspense>
);

export default OpsApp;