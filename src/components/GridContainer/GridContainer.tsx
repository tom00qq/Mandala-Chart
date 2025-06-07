import React from "react";
import { type Mode } from "@/App";
import { GridView3x3 } from "@/components/GridView3x3/GridView3x3";

interface GridContainerProps {
  mode: Mode;
}

const GridContainer: React.FC<GridContainerProps> = ({ mode }) => {
  return (
    <div className="w-full h-[100vh] max-w-[1800px] mx-auto flex items-center">
      {mode === "3x3" ? <GridView3x3 /> : ""}
    </div>
  );
};

export default GridContainer;
