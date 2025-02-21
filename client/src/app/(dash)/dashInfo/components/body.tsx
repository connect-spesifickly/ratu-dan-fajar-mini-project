/* eslint-disable @next/next/no-img-element */
"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import * as React from "react";
import { useState, useEffect } from "react";

interface UpdateResponse {
  data: {
    total_event: number;
    total_transaction: number;
    total_ticket_sold: number;
    total_sold: number;
  };
}
export function Body() {
  const { data: session } = useSession();
  const [totalEvent, setTotalEvent] = useState<number>(0);
  const [totalTransaction, setTotalTransaction] = useState<number>(0);
  const [totalTicketSold, setTotalTicketSold] = useState<number>(0);
  const [totalSold, setTotalSold] = useState<number>(0);
  const section = {
    total_event: totalEvent,
    total_transaction: totalTransaction,
    total_ticket_sold: totalTicketSold,
    total_sold: totalSold,
  };
  useEffect(() => {
    async function fetchData() {
      if (!session) {
        return;
      }
      if (session) {
        const token = session?.user.access_token;
        if (!token) {
          throw new Error("Token not found");
        }
        const res = await axios.get<UpdateResponse>(
          "http://localhost:8002/api/dash/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const {
          total_event,
          total_transaction,
          total_ticket_sold,
          total_sold,
        } = res.data?.data;
        setTotalEvent(total_event || 0);
        setTotalTransaction(total_transaction || 0);
        setTotalTicketSold(total_ticket_sold || 0);
        setTotalSold(total_sold || 0);
      }
    }
    fetchData();
  }, [session]);
  return (
    <div className="mt-[63px]">
      <div className="bg-white mt-[2px] px-5 pt-2">
        {Object.keys(section).map((key) => (
          <div
            key={key}
            className="border border-gray-300 w-full h-[135px] rounded-sm my-4"
          >
            <div className="mx-3">
              {/* bagian atas */}
              <div className="h-[50px] border-b border-gray-300 flex justify-between items-center w-full">
                <div className="flex gap-4">
                  <img
                    src={
                      key === "total_event"
                        ? "https://assets.loket.com/images/dashboard/loket-event-aktif.svg"
                        : key === "total_transaction"
                        ? "https://assets.loket.com/images/dashboard/loket-total-transaksi.svg"
                        : key === "total_ticket_sold"
                        ? "https://assets.loket.com/images/dashboard/loket-total-tiket-terjual.svg"
                        : key === "total_sold"
                        ? "https://assets.loket.com/images/dashboard/loket-total-pendapatan.svg"
                        : ""
                    }
                    alt=""
                    className="w-[15px]"
                  />
                  <div className="mb-[-2px]">{key.replace(/_/g, " ")}</div>
                </div>
                <div className="text-[14px] text-[#E76B31] font-semibold mb-[-4px]">
                  {key == "total_event" ? (
                    <a href="../eventsInfo">Detail</a>
                  ) : key == "total_transaction" ? (
                    <a href="../transactionChart">Chart</a>
                  ) : null}
                </div>
              </div>
              {/* bagian bawah */}
              <div className="flex items-center h-[80px] gap-4">
                {key === "total_sold" ? (
                  <div className="text-[40px]">
                    Rp{" "}
                    {section[key as keyof typeof section].toLocaleString(
                      "id-ID",
                      {
                        style: "decimal",
                      }
                    )}
                  </div>
                ) : (
                  <div className="text-[40px]">
                    {section[key as keyof typeof section]}
                  </div>
                )}
                <div className="">
                  {key
                    .replace(/total_/g, " ")
                    .replace(/_/g, " ")
                    .replace(/sold/g, " ")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
