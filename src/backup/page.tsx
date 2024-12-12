"use client";

// ** import core package
import { useState, useEffect } from "react";
import Image from "next/image";

import Webcam from "react-webcam";

// ** import images
import logo from "@/assets/image/logo-1.png";
import face from "@/assets/image/default-face.png";

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  // ** State for toggling between image and webcam
  const [isScanning, setIsScanning] = useState<boolean>(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const formattedDate = `${now.getDate().toString().padStart(2, "0")}-${(
        now.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${now.getFullYear()}`;

      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      setCurrentTime(formattedTime);
      setCurrentDate(formattedDate);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  // ** Function to toggle scanning state
  const handleToggleScanning = () => {
    setIsScanning((prev) => !prev);
  };

  return (
    <main className="min-h-screen relative">
      <nav className="py-8 px-10">
        <div className="flex items-center justify-between gap-4">
          <Image
            src={logo}
            alt="Metabola Logo"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
          <div className="text-xl font-medium">
            {currentDate} | <span className="text-primary"> {currentTime}</span>
          </div>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center mx-10 mb-20 ">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-1">Quick Check inn</h1>
          <p className="text-primary text-2xl font-medium">Come Closer</p>
        </div>

        <div className="relative w-full max-w-xs p-5 aspect-square my-8">
          <div className="relative h-full bg-primary ">
            {isScanning ? (
              <Webcam height={300} width={300}
              className="h-full w-full"
              />
            ) : (
              <Image
                src={face}
                alt="Face Mesh Illustration"
                width={300}
                height={300}
                className="h-full w-full object-contain p-4"
              />
            )}
          </div>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary"></div>
          </div>
        </div>

        <button
          onClick={handleToggleScanning}
          className="bg-primary text-white hover:bg-opacity-10 duration-300 rounded-full px-10 py-3 font-semibold text-2xl"
        >
          {isScanning ? "Scanning" : "Click here"}
        </button>
      </section>

      <footer className="py-2.5 bg-teal-600 text-center fixed bottom-0 w-full">
        <p className="text-lg md:text-xl font-medium text-white">
          www.metabola.in
        </p>
      </footer>
    </main>
  );
}
