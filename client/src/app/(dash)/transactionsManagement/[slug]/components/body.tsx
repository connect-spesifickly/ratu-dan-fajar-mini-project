"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import * as React from "react";
import { useState, useEffect } from "react";
interface updateTransaction {
  data: {
    event_title?: string;
    transaction?: Array<{
      transaction_id?: number;
      status?: string;
      user?: {
        username: string;
      };
      transaction_proof?: string;
    }>;
  };
}
export default function Body() {
  const { data: session } = useSession();
  const [data, setData] = useState<updateTransaction>({
    data: {
      event_title: "",
      transaction: [
        {
          transaction_id: 0,
          status: "",
          user: {
            username: "",
          },
          transaction_proof: "",
        },
      ],
    },
  });
  const { slug } = useParams();
  const updateData = async (status?: string, transaction_id?: number) => {
    if (session) {
      const token = session?.user.access_token;
      if (!token) {
        throw new Error("Token not found");
      }
      const update = { status, transaction_id };
      console.log("ini update", update);
      const res = await axios.patch<updateTransaction>(
        `http://localhost:8002/api/dash/transaction/${slug}`,
        update,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(res.data);
    }
  };
  useEffect(() => {
    updateData();
  }, [session]);

  return (
    <div className="pt-[56px] px-5 my-2">
      <div className="border-b-2 py-1 text-[20px] font-semibold text-gray-600">
        {data.data.event_title}
      </div>
      <div className="pb-2">
        <ul>
          <div className="pt-2 bg-white sticky top-[56px]">
            <li className="  flex justify-around items-center border-y-2 py-4 bg-gray-100">
              <div className="w-[33%]  pl-2  text-gray-700 text-[13px] font-semibold">
                Nama Pembeli
              </div>
              <div className="flex justify-around w-[66%] items-center ">
                <div className="w-full text-center text-gray-700 text-[13px] font-semibold">
                  Status
                </div>
                <div className=" w-full text-center text-gray-700 text-[13px] font-semibold">
                  Nota
                </div>
              </div>
            </li>
          </div>
          {data.data.transaction?.map((items) => (
            <li
              key={items.transaction_id}
              className="flex justify-around items-center  border-y "
            >
              <div className="w-[33%] font-semibold pl-2 text-gray-500 text-[13px] py-4 ">
                {items.user?.username.slice(0, 14)}
              </div>
              <div className="flex w-[66%] items-center justify-around py-3 ">
                {items.status == "waiting_organizer_confirmation" ? (
                  <div className="flex gap-1 sm:gap-2 w-full items-center justify-center text-center font-semibold text-gray-500 text-[13px]">
                    <button
                      onClick={() => updateData("done", items.transaction_id)}
                      className="text-[#8DC349] hover:bg-gray-200 bg-gray-50 border border-gray-300 rounded-sm p-1 w-[55px]"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        updateData("rejected", items.transaction_id)
                      }
                      className="text-[#EE4A69] hover:bg-gray-200  bg-gray-50 border border-gray-300 rounded-sm p-1 w-[55px]"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-1 sm:gap-2 w-full items-center justify-center text-center font-semibold text-gray-500 text-[13px]">
                    {items.status == "done" ? (
                      <div className="text-[#8DC349]  p-1 w-full">
                        {items.status}
                      </div>
                    ) : items.status == "rejected" ? (
                      <div className="text-[#EE4A69]  p-1 w-full">
                        {items.status}
                      </div>
                    ) : (
                      <div className="p-1 w-full">{items.status}</div>
                    )}
                  </div>
                )}
                <div className=" w-full text-center font-semibold text-gray-500 text-[13px]">
                  None
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
