"use client";
import * as React from "react";
import * as Yup from "yup";
import Axios from "axios";
import { useFormik } from "formik";
const RegisterSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  username: Yup.string().required(),
  password: Yup.string().required(),
  role: Yup.mixed()
    .oneOf(
      ["customer", "organizer"],
      "Role must be either 'customer' or 'organizer'"
    )
    .required("Role is required"),
  applied_reference_code: Yup.string(),
});

type Role = "customer" | "organizer";

interface IRegisterForm {
  email: string;
  username: string;
  password: string;
  role: Role;
  applied_reference_code?: string;
}

export default function RegisterPage() {
  const initialValues: IRegisterForm = {
    email: "",
    username: "",
    password: "",
    role: "customer",
    applied_reference_code: "",
  };

  const submitRegister = async (values: IRegisterForm) => {
    console.log(values);
    await Axios.post("http://localhost:8002/api/auth/register", values)

      .then((response) => {
        alert("Register Success, Please Go To Login Page");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formik = useFormik({
    initialValues,
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      submitRegister(values);
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
              Buat akun Loket kamu
            </h1>
            <div className="flex">
              <p className="text-[14px] pt-[5px]">Sudah punya akun? </p>{" "}
              <a className="text-[14px] pt-[5px] pl-1" href="/loginPage">
                {" "}
                <b>Masuk</b>
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
              <h2 className="text-[14px] py-[10px]">Username</h2>
              <input
                className="border-2 border-[#E0E0E0] rounded-lg w-[350px] h-[40px] pl-2"
                type="text"
                value={formik.values.username}
                name="username"
                onChange={formik.handleChange}
                id="username"
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-500 text-sm">{formik.errors.username}</p>
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
            <div className="">
              <h2 className="text-[14px] py-[10px]">Role</h2>
              <div className="flex w-[350px] h-[20px] justify-between items-center">
                <div className="">
                  <input
                    className="border-2 border-[#E0E0E0] rounded-lg "
                    type="radio"
                    id="customer"
                    name="role"
                    value="customer"
                    onChange={formik.handleChange}
                    checked={formik.values.role === "customer"}
                  />
                  <label className="pl-3 text-[14px]" htmlFor="Customer">
                    Customer
                  </label>
                </div>
                <div className="">
                  <input
                    className="border-2 border-[#E0E0E0] rounded-lg "
                    type="radio"
                    id="organizer"
                    name="role"
                    onChange={formik.handleChange}
                    value="organizer"
                    checked={formik.values.role === "organizer"}
                  />
                  <label className="pl-3 text-[14px]" htmlFor="Organizer">
                    Organizer
                  </label>
                </div>
              </div>
            </div>
            <div className="">
              <h2 className="text-[14px] py-[10px]">Reference Code</h2>
              <input
                className="border-2 border-[#E0E0E0] rounded-lg w-[350px] h-[40px] pl-2"
                type="applied_reference_code"
                value={formik.values.applied_reference_code}
                name="applied_reference_code"
                onChange={formik.handleChange}
                id="applied_reference_code"
              />
            </div>
            <div className="pt-[20px]">
              <button
                className="bg-[#0049CB] rounded-lg border-2 border-[#0072FF] h-[40px] font-semibold my-auto text-light text-white w-[350px] items-center justify-center"
                type="submit"
              >
                <p className=" ">Daftar</p>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
