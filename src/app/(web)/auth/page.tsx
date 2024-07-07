"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { signUp } from "next-auth-sanity/client";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const page = () => {
  const inputStyles =
    "border border-gray-300 sm:text-sm text-black rounded-lg block w-full p-2.5 focus:outline-none";

  const defaultFormData = {
    email: "",
    name: "",
    password: "",
  };
  const [formData, setFormData] = useState(defaultFormData);
  const router = useRouter();
  const { data: session } = useSession();
  console.log("session....", session);

  useEffect(() => {
    if (session) router.push("/");
  }, [router, session]);
  const loginHandler = async () => {
    try {
      await signIn();
      // push the user to the home page
      router.push("/");
    } catch (error: any) {
      toast.error("Something went wrong. ", error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const user = await signUp(formData);
      if (user) {
        toast.success("Success, Please sign in.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setFormData(defaultFormData);
    }
  };
  return (
    <section className="container max-auto">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-80 md:w-[70%] mx-auto">
        <div className="flex mb-8 flex-col md:flex-row items-center justify-between">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            Create an account
          </h1>
          <p>OR</p>
          <span className="inline-flex items-center">
            <AiFillGithub
              className="mr-3 text-4xl cursor-pointer text-black dark:text-white"
              onClick={loginHandler}
            />
            |
            <FcGoogle className="ml-3 text-4xl cursor-pointer" onClick={loginHandler} />
          </span>
        </div>

        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="name@company.com"
            required
            className={inputStyles}
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="name"
            onChange={handleInputChange}
            placeholder="Input your user name"
            required
            className={inputStyles}
            value={formData.name}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="password"
            required
            minLength={6}
            className={inputStyles}
          />
          <button
            type="submit"
            className="w-full bg-tertiary-dark focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Sign Up
          </button>

          <button className="text-blue-700 underline" onClick={loginHandler}>
            login
          </button>
        </form>
      </div>
    </section>
  );
};

export default page;
