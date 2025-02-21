"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
interface IResponse {
  data: {
    event_title: string;
    transaction: {
      transaction_id: number;
      quantity: number;
      total_price: number;
      user: {
        username: string;
      };
    }[];
  };
}
export default function Body() {
  const { data: session } = useSession();
  const [event, setEvent] = useState<IResponse | null>(null);
  const { slug } = useParams();
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
        const res = await axios.get<IResponse>(
          `http://localhost:8002/api/dash/event/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("response data", res.data);
        setEvent(res.data);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
  return (
    <div className="pt-[56px] px-5 my-2 ">
      <div className="border-b-2 py-1 text-[20px] font-semibold text-gray-600">
        {event?.data.event_title}
      </div>
      <div className="py-2">
        <ul>
          <div className="pt-2 bg-white sticky top-[56px]">
            <li className="flex justify-around items-center border-y-2 py-4 bg-gray-100">
              <div className="w-[33%]  pl-2  text-gray-700 text-[13px] font-semibold">
                Nama Pembeli
              </div>
              <div className="flex justify-around w-[66%] items-center ">
                <div className=" w-full text-center text-gray-700 text-[13px] font-semibold">
                  Banyak Tiket
                </div>
                <div className=" w-full text-center text-gray-700 text-[13px] font-semibold">
                  Total Harga
                </div>
              </div>
            </li>
          </div>
          {event?.data.transaction.map((item) => (
            <li
              key={item.transaction_id}
              className="flex justify-around items-center  border-y py-4"
            >
              <div className="w-[33%] font-semibold pl-2 text-gray-500 text-[13px]">
                {item.user.username.slice(0, 14)}
              </div>
              <div className="flex w-[66%] items-center justify-around">
                <div className=" w-full text-center font-semibold text-gray-500 text-[13px]">
                  {item.quantity}
                </div>
                <div className=" w-full text-center font-semibold text-gray-500 text-[13px]">
                  {item.total_price}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
