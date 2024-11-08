"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dic from "../../dictonary/data.json";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqData: FAQItem[];
  title: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqData, title }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
          {title}
        </h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <button
                className="w-full text-left p-4 focus:outline-none"
                onClick={() => toggleQuestion(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {faq.question}
                  </h3>
                  <motion.span
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-500 dark:text-gray-400"
                  >
                    ▼
                  </motion.span>
                </div>
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="p-4 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FAQPage: React.FC = () => {
  const faqData: FAQItem[] = [];
  const questions = dic["components-text"].faq.questions as Record<
    string,
    string
  >;
  const answers = dic["components-text"].faq.answers as Record<string, string>;
  const title = dic["components-text"].faq.title;

  for (let i = 1; i <= Object.keys(questions).length; i++) {
    const questionKey = `question${i}` as keyof typeof questions;
    const answerKey = `answer${i}` as keyof typeof answers;
    if (questions[questionKey] && answers[answerKey]) {
      faqData.push({
        question: questions[questionKey],
        answer: answers[answerKey],
      });
    }
  }

  return (
    <div className="min-h-screen">
      <FAQSection faqData={faqData} title={title} />
    </div>
  );
};

export default FAQPage;