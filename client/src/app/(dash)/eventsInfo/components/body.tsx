/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import * as React from "react";
import { useEffect, useState } from "react";

interface Event {
  event_id: number;
  event_title: string;
  event_img: string;
  category: {
    category_by_location: string;
  };
  start_at: string;
  end_at: string;
  slug: string;
}

export default function Body() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);

  const fetchEvents = async (page = 1): Promise<Event[]> => {
    const token = session?.user.access_token;
    const res = await axios.get(
      `http://localhost:8002/api/dash/events?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response data", res.data);
    if (res.status !== 200) {
      throw new Error("failed to fetch events");
    }
    const data = res.data as { data: Event[] };
    return data.data;
  };

  useEffect(() => {
    if (session?.user.access_token) {
      fetchEvents(page)
        .then((data) => setEvents([...data]))
        .catch(console.error);
    }
    console.log("hasil event", events);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, session]);

  return (
    <div className="">
      {events.map((event) => (
        <div key={event.event_id}>
          <a href={`../../eventManagement/${event.slug}`}>
            <div className="bg-white mt-[2px] px-5">
              <div className="flex flex-col border border-gray-300 w-full h-[345px] rounded-sm my-4">
                {/* Bagian Atas */}
                <div className="bg-blue-100 relative h-[120px] w-full border border-gray-300">
                  <div className=" absolute ">
                    <img
                      src={
                        event.event_img ||
                        " https://img.freepik.com/free-vector/blue-curve-background_53876-113112.jpg?t=st=1739858441~exp=1739862041~hmac=93fc542de2a8e6d31b8fd744c3a8b1a0a5b101c275f3d9851805224cbcadf17a&w=1380"
                      }
                      alt=""
                      className=" object-cover w-[100vw] h-[120px]"
                    />{" "}
                  </div>
                </div>
                <div className="px-4">
                  {/* Bagian Tengah */}
                  <div className="h-[73px] border-b">
                    <div className="py-2 font-semibold text-gray-600">
                      {event.event_title}
                    </div>
                    <div className="text-[10px] text-[#E76B36]">
                      {event.category.category_by_location}
                    </div>
                  </div>
                  {/* Bagian Bawah */}
                  <div className="pt-3 flex flex-col gap-1">
                    <div className="pt-1">
                      <div className="text-[12px] py-2 font-semibold text-gray-600">
                        Tanggal
                      </div>
                      <div className="text-[11px] pl-6 text-gray-500">
                        {event.start_at.slice(0, 10)} -{" "}
                        {event.end_at.slice(0, 10)}
                      </div>
                    </div>
                    <div className="pb-1">
                      <div className="text-[12px] py-2 font-semibold text-gray-600">
                        Lokasi
                      </div>
                      <div className="text-[11px] pl-6 text-gray-500">
                        {event.category.category_by_location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      ))}
      <div className="flex justify-center items-center gap-1 pb-[17px]">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          <ChevronLeft />
        </Button>
        <div className="flex justify-center items-center text-[12px] w-[35.7px] h-[35.7px] bg-[#0049CB] text-white border border-gray-300 rounded-md">
          {page}
        </div>{" "}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage((prev) => prev + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
