"use client";

import { motion } from "framer-motion";
import data from "../../dictonary/data.json"
import React from "react";
import EcoScanUploader from "../buttons/EcoScanUploader";

const heroVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const titleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const taglineVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3, ease: "easeOut" } },
};

export const HeroSection = () => {
  return (
    <div className="flex flex-col dark:bg-black bg-white min-h-screen justify-center items-center" data-testid="app-hero">
      <motion.div
        className="justify-center items-center rounded-[25px] m-2"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <motion.div className="w-full flex flex-col text-black dark:text-white justify-center items-center" variants={titleVariants}>
          <div className="flex flex-col text-center">
            <motion.span
              className="font-black text-[60px] sm:text-[80px] md:text-[100px] lg:text-[150px] xl:text-[170px] uppercase knewave-regular text-black dark:text-white"
              variants={titleVariants}
            >
              {data.title}
            </motion.span>
          </div>
          <motion.span
            className="text-center text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300"
            variants={taglineVariants}
          >
            {data.herosction.tagline.split("Exposed.").map((text, index) => (
              <React.Fragment key={index}>
                {text}
                {index === 0 ? "Exposed." : ""}
                {index === 0 && <br />}
              </React.Fragment>
            ))}
          </motion.span>
        </motion.div>

        <motion.div className="h-[170px] p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <EcoScanUploader />
        </motion.div>
      </motion.div>
    </div>
  );
};
