import { Navbar } from "@/components/navbar";
import * as React from "react";
import Body from "./components/body";

export default function TransactionManagement() {
  return (
    <div>
      <Navbar name="Transactions" />
      <Body />
    </div>
  );
}
