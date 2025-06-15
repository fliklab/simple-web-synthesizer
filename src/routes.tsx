import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { SynthList } from "./pages/SynthList";

const SampleSynth = lazy(() => import("./models/SampleSynth"));
const RetroSynth = lazy(() => import("./models/RetroSynth"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <SynthList />,
  },
  {
    path: "/samplesynth",
    element: <SampleSynth />,
  },
  {
    path: "/retrosynth",
    element: <RetroSynth />,
  },
];
