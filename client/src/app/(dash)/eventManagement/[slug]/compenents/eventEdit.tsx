/* eslint-disable @next/next/no-img-element */
"use client";
import { responseGetEvent } from "@/interfaces/next-auth";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
export default function EventEditComponent() {
  const { data: session } = useSession();
  const [event, setEvent] = useState<responseGetEvent["data"] | null>(null);
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
        const res = await axios.get<responseGetEvent>(
          `http://localhost:8002/api/dash/event/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("response data", res.data?.data);
        setEvent(res.data?.data);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
  return (
    <div className="mt-[63px]">
      <div>
        <div className="bg-white mt-[2px] px-5">
          <div className="py-2 font-semibold text-gray-600 border-b-2">
            {event?.event_title}
          </div>
          <div className=" flex flex-col border border-gray-300 w-full h-[315px] rounded-sm my-4">
            {/* Bagian Atas */}
            <div className="relative h-[163px] w-full border border-gray-300">
              <div>
                <img
                  src={
                    event?.event_img ||
                    " https://img.freepik.com/free-vector/blue-curve-background_53876-113112.jpg?t=st=1739858441~exp=1739862041~hmac=93fc542de2a8e6d31b8fd744c3a8b1a0a5b101c275f3d9851805224cbcadf17a&w=1380"
                  }
                  alt=""
                  className=" object-cover w-[100vw] h-[163px]"
                />{" "}
              </div>
              <a
                href={`../../eventEdit/${event?.slug}`}
                className="absolute right-1 top-1 py-[3px] px-[5px] text-[12px] border border-[#E76B31] text-[#E76B31] hover:bg-[#E76B31] bg-[#ffffff] hover:text-white rounded-sm"
              >
                Edit Event
              </a>
            </div>
            <div className="px-4">
              {/* Bagian Bawah */}
              <div className="pt-3 flex gap-1 justify-between w-[55%]">
                <div className="pt-1">
                  <div className="text-[12px] py-2 font-semibold text-gray-600">
                    Tanggal
                  </div>
                  <div className="text-[11px] pl-2 sm:pl-6 text-gray-500">
                    {event?.start_at.slice(0, 10)} -{" "}
                    {event?.end_at.slice(0, 10)}
                  </div>
                </div>
                <div className="pt-1">
                  <div className="text-[12px] py-2 font-semibold text-gray-600">
                    Lokasi
                  </div>
                  <div className="text-[11px] pl-2 sm:pl-6 text-gray-500">
                    {event?.category.category_by_location}
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <div className="text-[12px] py-2  font-semibold text-gray-600">
                  Deskripsi
                </div>
                <div className="text-[11px] pl-2 sm:pl-6 text-gray-500">
                  {event?.description.slice(0, 50)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
