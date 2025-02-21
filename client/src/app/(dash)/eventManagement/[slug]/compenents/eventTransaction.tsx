/* eslint-disable @next/next/no-img-element */
"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import * as React from "react";
import { responseGetEvent } from "@/interfaces/next-auth.d";
export default function EventTransComponent() {
  const { data: session } = useSession();
  const [pendapatan, setPendapatan] = useState<number>(0);
  const [transaksi, setTransaksi] = useState<number>(0);
  const [tiketTerjual, setTiketTerjual] = useState<number>(0);
  const [slotTiket, setSlotTiket] = useState<number>(0);
  const [pengunjung, setPengunjung] = useState<number>(0);
  const { slug } = useParams();
  const section = {
    Pendapatan: pendapatan,
    Tiket_Terjual: tiketTerjual,
    Transaksi_Terkonfirmasi: transaksi,
    Pengunjung_Terkonfirmasi: pengunjung,
  };
  console.log("slug", slug);
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
        const res = await axios.get<responseGetEvent>(
          `http://localhost:8002/api/dash/event/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("response data", res.data?.data);
        const pendapatan = res.data?.data.transaction.reduce(
          (total: number, item: { total_price: number }) => {
            return total + item.total_price;
          },
          0
        );
        const tiketTerjual = res.data?.data.transaction.reduce(
          (total: number, item: { quantity: number }) => {
            return total + item.quantity;
          },
          0
        );
        const slotTiket = res.data?.data.avaiable_slot;
        const Transaksi = res.data?.data.transaction.length;
        setPendapatan(pendapatan || 0);
        setTiketTerjual(tiketTerjual || 0);
        setSlotTiket(slotTiket || 0);
        setTransaksi(Transaksi || 0);
        setPengunjung(Transaksi || 0);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
  return (
    <div className=" px-5 pb-4">
      <div className="border border-gray-300 rounded-sm">
        {Object.keys(section).map((key) => (
          <div className="" key={key}>
            <div className="border-b border-gray-300 ">
              <div className="flex gap-5 items-center w-full h-[80px] ">
                <div className="h-[60px] w-[75px] flex justify-center items-center border-r-2 border-gray-300">
                  <img
                    src={
                      key === "Pendapatan"
                        ? "https://assets.loket.com/images/dashboard/loket-total-pendapatan.svg"
                        : key === "Transaksi_Terkonfirmasi"
                        ? "https://assets.loket.com/images/dashboard/loket-total-transaksi.svg"
                        : key === "Tiket_Terjual"
                        ? "https://assets.loket.com/images/dashboard/loket-total-tiket-terjual.svg"
                        : key === "Pengunjung_Terkonfirmasi"
                        ? "https://assets.loket.com/images/dashboard/loket-total-pengunjung.svg"
                        : ""
                    }
                    alt=""
                    className="w-[35px]"
                  />
                </div>
                <div className="flex  justify-between h-[55px] w-full">
                  <div className="">
                    <div className="text-[12px] font-semibold text-gray-400">
                      {key
                        .replace(/total_/g, " ")
                        .replace(/_/g, " ")
                        .replace(/sold/g, " ")}
                    </div>
                    <div className="text-[23px] ">
                      <div className="">
                        {key === "Pendapatan" ? (
                          <div className="">
                            Rp{" "}
                            {section[
                              key as keyof typeof section
                            ].toLocaleString("id-ID", {
                              style: "decimal",
                            })}
                          </div>
                        ) : key === "Tiket_Terjual" ? (
                          <div className="flex gap-1 items-center">
                            {section[key as keyof typeof section]}
                            <div className="text-gray-400 flex gap-1">
                              /{" "}
                              <div className=" text-[11px] mt-[13px]">
                                {slotTiket}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="">
                            {section[key as keyof typeof section]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {(key == "Pengunjung_Terkonfirmasi" ||
                    key == "Transaksi_Terkonfirmasi") && (
                    <div className="text-[12px] font-semibold text-gray-400 pr-3">
                      <a
                        href={
                          key == "Pengunjung_Terkonfirmasi"
                            ? `../../attendeeList/${slug}`
                            : key == "Transaksi_Terkonfirmasi"
                            ? `../../transactionsManagement/${slug}`
                            : ""
                        }
                        className=" text-[#E76B31] font-semibold"
                      >
                        Detail
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
