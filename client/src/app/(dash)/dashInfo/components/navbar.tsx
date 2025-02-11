/* eslint-disable @next/next/no-img-element */
"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import * as React from "react";
import { useState, useEffect } from "react";
interface UpdateResponse {
  data: {
    img_src?: string;
  };
}
export const Navbar = () => {
  const { data: session } = useSession();
  const [image, setImage] = useState<string>("");
  useEffect(() => {
    async function fetchData() {
      if (!session) {
        return;
      }
      if (session) {
        const token = session?.user.access_token;
        const values = {};
        if (!token) {
          throw new Error("Token not found");
        }
        const res = await axios.patch<UpdateResponse>(
          "http://localhost:8002/api/auth/",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { img_src } = res.data?.data;
        setImage(img_src || session?.user.img_src || "");
      }
    }
    fetchData();
  }, [session]);

  return (
    <div className="fixed top-0 w-full z-50">
      <div className="flex justify-between items-center px-5 py-1 bg-base-100 text-black shadow-md">
        <div className="text-[22px] font-bold">
          <Link href="/">Loket</Link>
        </div>
        <div className="">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-9 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={
                    image ||
                    "https://teknogram.id/gallery/foto-profil-wa/keren/pp-wa-kosong-keren-5.jpg"
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Transaction</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
