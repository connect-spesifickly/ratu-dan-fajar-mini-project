/* eslint-disable @next/next/no-img-element */
"use client";
import { useSession } from "next-auth/react";
import * as React from "react";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { Navbar } from "../../../components/navbar";
// import  {headers}  from "next/headers";

const UpdateSchema = Yup.object().shape({
  username: Yup.string()
    .optional()
    .min(3, "Username must be at least 3 characters"),
  password: Yup.string()
    .optional()
    .min(6, "Password must be at least 6 characters"),
  img_src: Yup.string().optional(),
});

interface IUpdateForm {
  username: string;
  password?: string;
  img_src?: string;
}
interface UpdateResponse {
  data: {
    username: string;
    password?: string;
    img_src?: string;
    user_id?: number;
  };
}

export default function ProfileBody() {
  const { data: session } = useSession();

  console.log("ini session", session);
  //untuk mewadahi value dari hasil submit user sehingga valuenya bisa langsung diterapkan
  const [username, setUsername] = useState<string>("");
  const [image, setImage] = useState<string>("");

  //supaya datanya bisa langsung muncul saat page dibuka
  useEffect(() => {
    async function fetchData() {
      try {
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
          const { username, img_src } = res.data?.data;
          setUsername(username || session?.user.username || "");
          setImage(img_src || session?.user.img_src || "");
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [session]);

  const initialValues: IUpdateForm = {
    username: session?.user.username || "",
    password: "",
    img_src: session?.user.img_src || "",
  };

  const submitUpdate = async (values: IUpdateForm) => {
    try {
      const token = session?.user.access_token;
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.patch<UpdateResponse>(
        "http://localhost:8002/api/auth/",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("ini responsenya: ", response);
      alert("Update Success");
      const { username, img_src } = response.data?.data;
      console.log("ini username", username);
      console.log("ini img_src", img_src);
      setUsername(username || session?.user.username || "");
      setImage(img_src || session?.user.img_src || "");
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: UpdateSchema,
    onSubmit: (values) => {
      submitUpdate(values);
    },
  });
  return (
    <div className="">
      {" "}
      <Navbar name="Profil Kamu" />
      <div className="mt-[53px]">
        <form action="" onSubmit={formik.handleSubmit}>
          <div className="bg-white mt-[2px] px-5 pt-4">
            <h1 className="text-[20px] font-medium border-b-2 pb-1 border-slate-300">
              Informasi Dasar
            </h1>
            <div className="flex flex-col pt-[28px]">
              <div className=" text-[14px] font-bold text-slate-600">
                Gambar Profil
              </div>
              <p className="text-[14px] text-slate-600">
                Avatar dan foto sampul adalah gambar pertama yang akan dilihat
                di akun profilmu.
              </p>
              <div className="py-[30px] flex justify-between items-center gap-[50px] max-w-[750px]">
                <img
                  src={
                    image ||
                    "https://teknogram.id/gallery/foto-profil-wa/keren/pp-wa-kosong-keren-5.jpg"
                  }
                  alt=""
                  className="rounded-full w-[120px] object-cover aspect-square"
                />
                <div className="">
                  <h1 className="text-[14px] font-bold text-slate-600">
                    Avatar
                  </h1>
                  <p className="text-[14px] text-slate-600">
                    Tolong masukkan link foto profile anda dengan gambar persegi
                    dan beresolusi tinggi
                  </p>
                  <input
                    type="text"
                    className="focus:outline-none border-b-2 w-full focus:border-blue-600 transition duration-300 text-[14px] font-semibold text-slate-500 pb-[8px]"
                    name="img_src"
                    onChange={formik.handleChange}
                    id="img_src"
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
              <div className="py-[15px]">
                <div className="pb-[15px] text-[14px] font-bold text-slate-600">
                  Email
                </div>
                <div className="border-b-2 w-full text-[14px] text-slate-400 font-semibold pb-[8px]">
                  {session?.user.email || " "}
                </div>
              </div>
              <div className="py-[15px]">
                <div className="pb-[15px] text-[14px] font-bold text-slate-600">
                  Username
                </div>
                <input
                  type="text"
                  className="focus:outline-none border-b-2 w-full focus:border-blue-600 transition duration-300 text-[14px] font-semibold text-slate-500 pb-[8px]"
                  defaultValue={username}
                  // defaultValue={formik.values.username}
                  name="username"
                  onChange={formik.handleChange}
                  id="username"
                  onBlur={formik.handleBlur}
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.username}
                  </p>
                )}
              </div>
              <div className="py-[15px]">
                <div className="pb-[15px] text-[14px] font-bold text-slate-600">
                  Password
                </div>
                <input
                  type="password"
                  className="focus:outline-none border-b-2 w-full focus:border-blue-600 transition duration-300 text-[14px] font-semibold text-slate-500 pb-[8px]"
                  name="password"
                  onChange={formik.handleChange}
                  id="password"
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="py-[15px] mb-[80px]">
                <div className="pb-[15px] text-[14px] font-bold text-slate-600">
                  Referral Code
                </div>
                <div className="border-b-2 w-full text-[14px] text-slate-400 font-semibold pb-[8px] ">
                  {session?.user.reference_code || ""}
                </div>
              </div>
            </div>
          </div>
          <div className="py-[20px] bg-gray-50 fixed bottom-0 w-full px-5">
            <button
              className="bg-[#0049CB] rounded-sm  border-[#0072FF] h-[44px] w-full font-semibold text-light text-white items-center justify-center"
              type="submit"
            >
              <p className=" ">Simpan Perubahan</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
