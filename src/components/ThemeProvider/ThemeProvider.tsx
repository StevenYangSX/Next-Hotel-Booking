// This line indicates that this file is a client-side file in Next.js.
// This is useful for components that need to interact with the browser's APIs, like localStorage.

"use client";

import ThemeContext from "@/context/ThemeContext";
import { useEffect, useState } from "react";

//It accepts children as props, which are the child components that will be wrapped by this provider.
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  //this is acturally a boolean. meaning   isDarkTheme
  const themeFromStorage: boolean =
    typeof localStorage !== "undefined" && localStorage.getItem("hotel-theme")
      ? JSON.parse(localStorage.getItem("hotel-theme")!)
      : false;
  const [darkTheme, setDarkTheme] = useState<boolean>(themeFromStorage);

  const [renderComponent, setRenderComponent] = useState(false);

  useEffect(() => {
    setRenderComponent(true);
  }, []);

  if (!renderComponent) return <></>;
  return (
    <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
      <div className={`${darkTheme ? "dark" : ""} min-h-screen`}>
        <div className="dark:text-white dark:bg-black text-[#1E1E1E]">{children}</div>
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
