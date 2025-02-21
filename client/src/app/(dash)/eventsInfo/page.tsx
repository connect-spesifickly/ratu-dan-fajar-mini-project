import { Navbar } from "@/components/navbar";
import * as React from "react";
import BuatEvent from "./components/buatEvent";
import Body from "./components/body";

export default function EventInfo() {
  return (
    <div>
      <Navbar name="Event Saya" />
      <BuatEvent />
      <Body />
    </div>
  );
}
