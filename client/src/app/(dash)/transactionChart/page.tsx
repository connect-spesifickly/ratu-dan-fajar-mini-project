import * as React from "react";
import ChartComponent from "./components/chart";
import { Navbar } from "@/components/navbar";

export default function Chart() {
  return (
    <div>
      <Navbar name="Transaction Chart" />
      <ChartComponent />
    </div>
  );
}
