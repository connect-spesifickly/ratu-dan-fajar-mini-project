"use client";
import Axios from "axios";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import * as React from "react";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email().required(), // email is required
  password: Yup.string().required(), // password is required
});

interface ILoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const initialValues: ILoginForm = {
    email: "",
    password: "",
  };

  const submitLogin = async (values: ILoginForm) => {
    console.log(values);
    try {
      const response = await Axios.post<{
        data: { token: string };
        message?: string;
      }>("http://localhost:8002/api/auth/login", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Status:", response.status);
      const data = response.data;
      console.log("Login Data:", data);
      if (response.status === 200) {
        const token = response.data.data.token;
        console.log("ini data token", token);
        await signIn("credentials", {
          email: values.email,
          password: values.password,
        });
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      submitLogin(values);
    },
  });

  return (
    <div>
      <div
        className="hero min-h-[250px] min-w-screen bg-cover bg-center rounded-b-md"
        style={{
          backgroundImage:
            "url(https://assets.loket.com/web/assets/img/auth/bg-mask.png)",
        }}
      ></div>
      <div className="flex justify-center items-center h-full">
        <form
          className="w-[400px] bg-white rounded-2xl h-fit shadow-lg mt-[-170px] pb-[25px]"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex flex-col items-center h-full">
            <h1 className="text-[20px] font-extrabold pt-[20px]">
              Masuk ke akunmu
            </h1>
            <div className="flex">
              <p className="text-[14px] pt-[5px]">Belum punya akun Loket? </p>{" "}
              <a className="text-[14px] pt-[5px] pl-1" href="/registerPage">
                {" "}
                <b>Daftar</b>
              </a>
            </div>
            <div className="">
              <h2 className="text-[14px] py-[10px]">Email</h2>
              <input
                className="border-2 border-[#E0E0E0] rounded-lg w-[350px] h-[40px] pl-2"
                type="text"
                value={formik.values.email}
                name="email"
                onChange={formik.handleChange}
                id="email"
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>
            <div className="">
              <h2 className="text-[14px] py-[10px]">Password</h2>
              <input
                className="border-2 border-[#E0E0E0] rounded-lg w-[350px] h-[40px] pl-2"
                type="password"
                value={formik.values.password}
                name="password"
                onChange={formik.handleChange}
                id="password"
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              )}
            </div>
            <div className="pt-[20px]">
              <button
                className="bg-[#0049CB] rounded-lg border-2 border-[#0072FF] h-[40px] font-semibold my-auto text-light text-white w-[350px] items-center justify-center"
                type="submit"
              >
                <p className=" ">Login</p>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
