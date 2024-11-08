import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import FAQPage from "../faq";

// Mock the framer-motion module
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
    span: ({
      children,
      ...props
    }: React.PropsWithChildren<React.HTMLAttributes<HTMLSpanElement>>) => (
      <span data-testid="motion-span" {...props}>
        {children}
      </span>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock the data import
vi.mock("../../../dictonary/data.json", () => ({
  default: {
    "components-text": {
      faq: {
        title: "Frequently Asked Questions",
        questions: {
          question1: "Are you storing the images?",
          question2: "How accurate is the carbon footprint calculation?",
        },
        answers: {
          answer1: "No, we are not storing the images.",
          answer2:
            "Our carbon footprint calculation is based on the latest research and data.",
        },
      },
    },
  },
}));

describe("FAQPage", () => {
  it("renders the FAQ title correctly", () => {
    render(<FAQPage />);
    const titleElement = screen.getByText("Frequently Asked Questions");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass(
      "text-3xl",
      "font-bold",
      "text-center",
      "mb-8",
      "text-gray-800",
      "dark:text-gray-200"
    );
  });

  it("renders all FAQ questions", () => {
    render(<FAQPage />);
    const question1 = screen.getByText("Are you storing the images?");
    const question2 = screen.getByText(
      "How accurate is the carbon footprint calculation?"
    );
    expect(question1).toBeInTheDocument();
    expect(question2).toBeInTheDocument();
  });

  it("initially hides all answers", () => {
    render(<FAQPage />);
    const answer1 = screen.queryByText("No, we are not storing the images.");
    const answer2 = screen.queryByText(
      "Our carbon footprint calculation is based on the latest research and data."
    );
    expect(answer1).not.toBeInTheDocument();
    expect(answer2).not.toBeInTheDocument();
  });

  it("shows answer when question is clicked", () => {
    render(<FAQPage />);
    const question1 = screen.getByText("Are you storing the images?");
    fireEvent.click(question1);
    const answer1 = screen.getByText("No, we are not storing the images.");
    expect(answer1).toBeInTheDocument();
  });

  it("hides answer when question is clicked again", () => {
    render(<FAQPage />);
    const question1 = screen.getByText("Are you storing the images?");
    fireEvent.click(question1);
    const answer1 = screen.getByText("No, we are not storing the images.");
    expect(answer1).toBeInTheDocument();
    fireEvent.click(question1);
    expect(answer1).not.toBeInTheDocument();
  });

  it("applies correct classes to FAQ items", () => {
    render(<FAQPage />);
    const faqItems = screen.getAllByTestId("motion-div");
    expect(faqItems[0]).toHaveClass(
      "bg-white",
      "dark:bg-gray-800",
      "rounded-lg",
      "shadow-md",
      "overflow-hidden"
    );
  });

  it("renders the correct number of FAQ items", () => {
    render(<FAQPage />);
    const faqItems = screen.getAllByRole("button");
    expect(faqItems).toHaveLength(2);
  });
});
