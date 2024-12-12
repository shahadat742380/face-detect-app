"use client";

// ** Import core packages
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// ** import third party package
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

// ** Import images
import logo from "@/assets/image/logo-1.png";
import face from "@/assets/image/default-face.png";

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  // ** State for toggling between image and webcam
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // ** State for loading models
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false);

  // Webcam and canvas references
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // ** Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // Path to your models folder in public directory
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
    };

    loadModels();
  }, []);

  // ** Face detection function
  const detectFaces = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      modelsLoaded &&
      canvasRef.current
    ) {
      const video = webcamRef.current.video as HTMLVideoElement;

      // Ensure video is ready before proceeding
      if (video.readyState !== 4) {
        // 4 means the video is "HAVE_ENOUGH_DATA"
        console.log("Video not ready for face detection");
        return;
      }

      try {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        if (!detections || detections.length === 0) {
          console.log("No faces detected");
          return;
        }

        const canvas = canvasRef.current;
        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };

        faceapi.matchDimensions(canvas, displaySize);
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }
      } catch (error) {
        console.error("Error during face detection:", error);
      }
    } else {
      console.warn("Webcam, video, or canvas is not ready for detection");
    }
  };

  // ** Toggle scanning
  const handleToggleScanning = () => {
    setIsScanning((prev) => !prev);
  };

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(detectFaces, 200);
      return () => clearInterval(interval);
    }
  }, [isScanning, modelsLoaded]);

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

      <section className="flex flex-col items-center justify-center mx-10 mb-20">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-1">Quick Check Inn</h1>
          <p className="text-primary text-2xl font-medium">Come Closer</p>
        </div>

        <div className="relative w-full max-w-xs p-5 aspect-square my-8">
          <div className="relative h-full bg-primary">
            {isScanning ? (
              <>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  className="h-full w-full"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />
              </>
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
          {isScanning ? "Stop Scanning" : "Click here to Scan"}
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
