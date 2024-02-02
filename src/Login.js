import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateWithServer = async (values) => {
    try {
      const response = await axios.post("http://localhost:8800/login", values, {
        withCredentials: true,
      });

      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token);
        login();
        navigate("/");
      } else {
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.log(error);

      if (error.response && error.response.data) {
        const errorMessage = error.response.data;

        if (errorMessage === "User is not registered") {
          throw new Yup.ValidationError(errorMessage, null, "email");
        } else if (errorMessage === "Incorrect password") {
          throw new Yup.ValidationError(errorMessage, null, "password");
        } else {
          console.error("Server error:", errorMessage);
          throw new Yup.ValidationError(
            "Login failed. Please try again.",
            null,
            "email"
          );
        }
      } else if (error instanceof Yup.ValidationError) {
        // Handle Yup validation error (e.g., display error messages)
        formik.setErrors({
          [error.path]: error.message,
        });
      } else {
        console.error("Unhandled error:", error);
        throw new Yup.ValidationError(
          "Login failed. Please try again.",
          null,
          "email"
        );
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: validateWithServer,
  });

  return (
    <div className="mx-auto min-h-screen p-5 bg-gradient-to-b from-green-50 via-lime-50 to-teal-50">
      <h1 className="text-center mt-9">Login</h1>
      <br />
      <br />

      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col mx-auto w-[90%] md:w-[60%] lg:w-[40%] xl:w-[40%]"
      >
        <input
          className={`h-[30px] border border-black focus:outline-none rounded-md px-2 ${
            formik.touched.email && formik.errors.email ? "border-red-500" : ""
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          type="email"
          name="email"
          placeholder="enter email..."
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500">{formik.errors.email}</div>
        ) : null}
        <br />
        <input
          className={`h-[30px] border border-black focus:outline-none rounded-md px-2 ${
            formik.touched.password && formik.errors.password
              ? "border-red-500"
              : ""
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          type="password"
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
          Login
        </button>
        <br /> <br />
        <p>
          Not registered?{" "}
          <Link to="/signup" className="underline text-blue-400">
            signup
          </Link>
        </p>
      </form>
    </div>
  );
}
