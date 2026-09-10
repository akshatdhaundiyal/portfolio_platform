"use client";

import React from "react";
import type { ProjectItem } from "@/lib/data/projects";
import BoardingPassSkin from "./skins/BoardingPassSkin";
import BaggageTagSkin from "./skins/BaggageTagSkin";
import RetroCrtSkin from "./skins/RetroCrtSkin";
import GarmentTagSkin from "./skins/GarmentTagSkin";
import SpiralNotebookSkin from "./skins/SpiralNotebookSkin";

interface ArtifactFrameProps {
  project: ProjectItem;
}

export default function ArtifactFrame({ project }: ArtifactFrameProps) {
  const skin = project.artifactSkin || "boarding-pass";

  switch (skin) {
    case "baggage-tag":
      return <BaggageTagSkin project={project} />;
    case "retro-crt":
      return <RetroCrtSkin project={project} />;
    case "garment-tag":
      return <GarmentTagSkin project={project} />;
    case "spiral-notebook":
      return <SpiralNotebookSkin project={project} />;
    case "boarding-pass":
    default:
      return <BoardingPassSkin project={project} />;
  }
}
