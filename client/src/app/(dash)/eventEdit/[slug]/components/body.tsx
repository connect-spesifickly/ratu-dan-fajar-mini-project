/* eslint-disable @next/next/no-img-element */
"use client";
import {
  CalendarDays,
  CircleDollarSign,
  MapPinned,
  ScrollText,
  Ticket,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import * as React from "react";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { useState, useEffect } from "react";

const UpdateSchema = Yup.object().shape({
  event_title: Yup.string().optional(),
  event_img: Yup.string().optional(),
  category: Yup.object().optional(),
  start_at: Yup.date().optional(),
  end_at: Yup.date().optional(),
  description: Yup.string().optional(),
  avaiable_slot: Yup.number().optional(),
  price: Yup.number().optional(),
});

interface UpdateResponse {
  data: {
    event_id: number;
    event_title: string;
    event_img: string;
    category: {
      category_by_location: string;
    };
    start_at: Date;
    end_at: Date;
    description: string;
    avaiable_slot: number;
    price: number;
  };
}

export default function Body() {
  const { data: session } = useSession();
  const [data, setData] = useState<UpdateResponse>({
    data: {
      event_id: 0,
      event_title: "",
      event_img: "",
      category: {
        category_by_location: "",
      },
      start_at: new Date(),
      end_at: new Date(),
      description: "",
      avaiable_slot: 0,
      price: 0,
    },
  });
  const { slug } = useParams();

  useEffect(() => {
    async function fetchData() {
      if (!session || !slug) return;

      if (session) {
        const token = session?.user.access_token;
        const values = {
          category: {
            category_by_location: "",
          },
        };
        if (!token) {
          throw new Error("Token not found");
        }
        console.log("ini value saat awal, values: ", values);
        const res = await axios.patch<UpdateResponse>(
          `http://localhost:8002/api/dash/${slug}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("response data", res.data);
        setData(res.data);
      }
    }
    fetchData();
  }, [session, slug]);

  const initialValues: UpdateResponse["data"] = {
    event_id: data.data.event_id || 0,
    category: {
      category_by_location: data.data.category.category_by_location || "",
    },
    event_img: data.data.event_img || "",
    event_title: data.data.event_title || "",
    start_at: data.data.start_at ? new Date(data.data.start_at) : new Date(),
    end_at: data.data.end_at ? new Date(data.data.end_at) : new Date(),
    description: data.data.description || "",
    avaiable_slot: data.data.avaiable_slot || 0,
    price: data.data.price || 0,
  };

  const submitUpdate = async (values: UpdateResponse["data"]) => {
    try {
      const token = session?.user.access_token;
      if (!token) {
        throw new Error("Token not found");
      }
      console.log("ini value saat edit, values: ", values);
      const response = await axios.patch<UpdateResponse>(
        `http://localhost:8002/api/dash/${slug}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("ini responsenya: ", response);
      alert("Update Success");
      setData(response.data);
      formik.setValues(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: UpdateSchema,
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
      submitUpdate(values);
    },
    enableReinitialize: true,
  });

  console.log("Formik errors:", formik.errors);
  console.log("Formik touched:", formik.touched);
  return (
    <div className="mt-[56px]">
      <form onSubmit={formik.handleSubmit}>
        {/* Image */}
        <div className="relative w-full h-[405px] flex justify-center items-center">
          <div className="absolute ">
            <img
              src={
                data.data.event_img ||
                " https://img.freepik.com/free-vector/blue-curve-background_53876-113112.jpg?t=st=1739858441~exp=1739862041~hmac=93fc542de2a8e6d31b8fd744c3a8b1a0a5b101c275f3d9851805224cbcadf17a&w=1380"
              }
              alt=""
              className=" object-cover w-[100vw] h-[405px]"
            />
          </div>
          <div className="absolute bottom-1">
            <div className="flex items-center px-2 w-[96vw] h-[40px] bg-white rounded-md">
              <div className="">URL:</div>
              <input
                name="event_img"
                onChange={formik.handleChange}
                id="event_img"
                onBlur={formik.handleBlur}
                value={formik.values.event_img}
                className="focus:outline-none border-b-2 w-full focus:border-blue-600 transition duration-300 text-[14px] font-semibold text-slate-500 pb-[1px]"
                type="text"
              />
            </div>
          </div>
        </div>
        {/* Title */}
        <div className="px-5 pb-[87px] ">
          <div className="py-3">
            <input
              value={formik.values.event_title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              className="focus:outline-none border-b-2 w-full focus:border-blue-600 transition duration-300 text-[24px] font-semibold text-slate-500 pb-[1px]"
              placeholder="Judul Event"
              id="event_title"
              name="event_title"
            />
          </div>
          {/* Date and Location */}
          <div className="flex items-center gap-1 pb-1">
            <div className="">
              <CalendarDays size={16} />
            </div>
            <input
              type="date"
              className="focus:outline-none border-b-2 w-[49vw] focus:border-blue-600 transition duration-300 text-[14px] font-semibold text-slate-500 pb-[1px]"
              placeholder="Tanggal Mulai"
              value={
                formik.values.start_at &&
                !isNaN(new Date(formik.values.start_at).getTime())
                  ? new Date(formik.values.start_at).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => {
                const dateValue = e.target.value
                  ? new Date(e.target.value).toISOString()
                  : "";
                formik.setFieldValue("start_at", dateValue);
              }}
              onBlur={formik.handleBlur}
              id="start_at"
              name="start_at"
            />
            -
            <input
              value={
                formik.values.end_at &&
                !isNaN(new Date(formik.values.end_at).getTime())
                  ? new Date(formik.values.end_at).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => {
                const dateValue = e.target.value
                  ? new Date(e.target.value).toISOString()
                  : "";
                formik.setFieldValue("end_at", dateValue);
              }}
              onBlur={formik.handleBlur}
              type="date"
              className="focus:outline-none border-b-2 w-[49vw] focus:border-blue-600 transition duration-300 text-[14px] font-semibold text-slate-500 pb-[1px]"
              placeholder="Tanggal Selesai"
              id="end_at"
              name="end_at"
            />
          </div>
          <div className=" flex items-center gap-1 pb-1">
            <div className="">
              <MapPinned size={16} />
            </div>
            <input
              value={formik.values.category.category_by_location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              className="focus:outline-none border-b-2 w-[100vw] focus:border-blue-600 transition duration-300 text-[14px] font-semibold text-slate-500 pb-[1px]"
              placeholder="Lokasi Kota"
              id="category.category_by_location"
              name="category.category_by_location"
            />
          </div>
          {/* Description */}
          <div className="pb-1 relative">
            <div className="absolute right-0">
              <ScrollText size={16} />
            </div>
            <textarea
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="focus:outline-none border-b-2 w-full h-[100px] focus:border-blue-600 transition duration-300 text-[14px] font-semibold text-slate-500 pb-[1px]"
              placeholder="Deskripsi"
              id="description"
              name="description"
            />
          </div>
          {/* Ticket */}
          <div className="flex items-center gap-1">
            <div className="">
              <Ticket size={16} />
            </div>
            <input
              value={formik.values.avaiable_slot}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              className="focus:outline-none border-b-2 w-full focus:border-blue-600 transition duration-300 text-[14px] font-semibold text-slate-500 pb-[1px]"
              placeholder="Jumlah Tiket"
              min={0}
              id="avaiable_slot"
              name="avaiable_slot"
            />
            <div className="text-[15px]">Tiket</div>
            <div className="">
              <CircleDollarSign size={16} />
            </div>
            <div className="text-[14px]">Rp.</div>
            <input
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              className="focus:outline-none border-b-2 w-full focus:border-blue-600 transition duration-300 text-[14px] font-semibold text-slate-500 pb-[1px]"
              placeholder="Harga"
              step={1000}
              min={0}
              id="price"
              name="price"
            />
          </div>
        </div>
        <div className="shadow-[0px_0px_5px_rgba(0,0,0,0.25)] flex items-center gap-1 justify-between py-[10px] bg-gray-50 fixed bottom-0 w-full px-5">
          <p className="text-[14px] text-justify">
            Perubahan yang kamu lakukan akan mengubah tampilan halaman eventmu
            secara publik
          </p>
          <button
            className="bg-[#ffffff] rounded-sm  border-black border-[1px] h-[44px] w-[200px] font-semibold text-light  items-center justify-center"
            type="submit"
          >
            <p className="text-[14px]">Simpan Perubahan</p>
          </button>
        </div>
      </form>
    </div>
  );
}
