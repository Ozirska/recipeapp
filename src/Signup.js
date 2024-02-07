import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Signup() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = () => {
    axios
      .post("https://recipeapp-server.vercel.app/signup", formik.values, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("authToken", res.data.token);
          login(res.data);
          navigate("/");
        } else {
          alert("No register user");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.data) {
          const field = error.response.data.field;
          const message = error.response.data.message;

          if (field) {
            formik.setErrors({ [field]: message });
          } else {
            console.error("Server error:", error);
            setServerError(
              "A unexpected error occured, please try again later.."
            );
          }
        }
      });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="mx-auto min-h-screen p-5 bg-gradient-to-b from-green-50 via-lime-50 to-teal-50">
      <h1 className="text-center mt-9">Signup</h1>
      <br />
      <br />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col mx-auto w-[90%] md:w-[60%] lg:w-[40%] xl:w-[40%]"
      >
        <input
          className=" h-[30px] border border-black focus:outline-none rounded-md px-2"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          type="text"
          name="name"
          placeholder="enter name..."
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-red-500">{formik.errors.name}</div>
        ) : null}
        {serverError ? <div className="text-red-500">{serverError}</div> : null}
        <br />
        <input
          className=" h-[30px] border border-black focus:outline-none rounded-md px-2"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          type="text"
          name="email"
          placeholder="enter email..."
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500">{formik.errors.email}</div>
        ) : null}
        <br />
        <input
          className=" h-[30px] border border-black focus:outline-none rounded-md px-2"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          type="text"
          name="password"
          placeholder="enter password..."
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="text-red-500">{formik.errors.password}</div>
        ) : null}
        <br />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
        >
          Signup
        </button>
        <br /> <br />
        <p>
          Already registered?
          <Link to="/login" className="underline text-blue-400">
            login
          </Link>
        </p>
      </form>
    </div>
  );
}
