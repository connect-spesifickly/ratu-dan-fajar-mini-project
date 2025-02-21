import { Navbar } from "@/components/navbar";
import * as React from "react";
import EventEditComponent from "./compenents/eventEdit";
import EventTransComponent from "./compenents/eventTransaction";

export default function EventEdit() {
  return (
    <div>
      <Navbar name="Event Management" />
      <EventEditComponent />
      <EventTransComponent />
    </div>
  );
}
