"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadImage } from "../other/api/api";
import CarbonFootprint from "../other/CarbonFootprint";
import CouponsSection from "../other/CouponsSection";
import HistorySection from "../other/History";
import data from "@/dictonary/data.json";
import RewardsSection from "../other/RewardsSection";

interface ApiResponse {
  carbonfootprint: {
    [key: string]: string;
  };
  coupons: {
    title: string;
    price: string;
    link: string;
  }[];
  coupontotal: string;
  ecosavings: number;
  model_used: string;
  image: string;
  total_footprint: string;
}

const CustomSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button
    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
      checked ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
    }`}
    onClick={onChange}
    aria-checked={checked}
    role="switch"
  >
    <motion.div
      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
      layout
      transition={{
        type: "spring",
        stiffness: 700,
        damping: 30
      }}
    />
  </button>
);

const CustomButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button
    className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default function EcoScanUploader() {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ApiResponse[]>([]);
  const [useCameraCapture, setUseCameraCapture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);

  useEffect(() => {
    const cachedHistory = localStorage.getItem("ecoScanHistory");
    if (cachedHistory) {
      setHistory(JSON.parse(cachedHistory));
    }
  }, []);

  useEffect(() => {
    if (useCameraCapture) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [useCameraCapture]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: isFrontCamera ? "user" : "environment"
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Failed to access camera. Please check your permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const switchCamera = async () => {
    // Stop the current stream
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    
    setIsFrontCamera(!isFrontCamera);
    // startCamera will be called by the useEffect below
  };

  useEffect(() => {
    if (useCameraCapture) {
      startCamera();
    }
  }, [isFrontCamera]);

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setImage(imageDataUrl);
      handleUpload(dataURLtoFile(imageDataUrl, 'captured_image.jpg'));
    }
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      await handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const response = await uploadImage(file);
      setApiResponse(response);
      if (response.image === "invalid") {
        setError("The uploaded image is invalid. Please try again with a different image.");
      } else {
        const updatedHistory = [response, ...history];
        setHistory(updatedHistory);
        localStorage.setItem("ecoScanHistory", JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(
        "Failed to upload image. Please check your internet connection and try again."
      );
      setApiResponse(null);
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setImage(null);
    setApiResponse(null);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center transition-colors duration-300">
      <AnimatePresence>
        {!apiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`relative w-full max-w-md aspect-video overflow-hidden ${
              isDragging
                ? "border-4 border-dashed border-blue-500 dark:border-blue-400"
                : "border-2 border-gray-300 dark:border-gray-700"
            } transition-colors duration-300 ease-in-out rainbow-border rounded-lg bg-white dark:bg-gray-800`}
          >
            <div className="absolute top-2 right-2 z-10 flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {useCameraCapture ? "Camera" : "Upload"}
              </span>
              <CustomSwitch checked={useCameraCapture} onChange={() => setUseCameraCapture(!useCameraCapture)} />
            </div>
            {useCameraCapture && (
              <div className="absolute top-2 left-2 z-10">
                <button
                  onClick={switchCamera}
                  className="bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-colors duration-200"
                  aria-label="Switch Camera"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => !useCameraCapture && fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {useCameraCapture ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <CustomButton
                    onClick={captureImage}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Capture Image
                  </CustomButton>
                </>
              ) : image ? (
                <motion.img
                  src={image}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <motion.div
                  className="text-center p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {data["upload-button"].uploadtext}
                    </span>{" "}
                    {data["upload-button"].dragtext}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    {data["upload-button"].fileformats}
                  </p>
                </motion.div>
              )}
              {isUploading && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md mt-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button
              onClick={resetUpload}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {apiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-6xl mt-8 space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CarbonFootprint data={apiResponse.carbonfootprint} model_used={apiResponse.model_used} image_status={apiResponse.image} total_footprint={apiResponse.total_footprint} />
              {image && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <motion.img
                    src={image}
                    alt="Uploaded"
                    className="w-full h-full max-h-[450px] object-cover"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <RewardsSection ecosavings={apiResponse.ecosavings} message={apiResponse.coupontotal} history={history} />
              <HistorySection history={history} />
            </div>
            <CouponsSection coupons={apiResponse.coupons} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {apiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <CustomButton
              className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold shadow-lg rounded-full"
              onClick={resetUpload}
            >
              {data["upload-button"].newupload}
            </CustomButton>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .rainbow-border::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff);
          background-size: 600% 600%;
          animation: rainbow 6s ease infinite;
          filter: blur(20px);
          opacity: 1;
        }
      `}</style>
    </div>
  );
}