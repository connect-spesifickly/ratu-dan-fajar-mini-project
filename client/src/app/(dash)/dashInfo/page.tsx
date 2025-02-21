import * as React from "react";
import { Navbar } from "../../../components/navbar";
import { Body } from "./components/body";

export default function DashInfo() {
  return (
    <div>
      <Navbar name="Home" />
      <Body />

      <div className="flex justify-center text-[10px] mt-[44px]">
        © 2025 LOKET. Semua Hak Cipta Dilindungi.
      </div>
    </div>
  );
}
