import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { HeroSection } from '../herosection';

// Mock the framer-motion module
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => 
      <div data-testid="motion-div" {...props}>{children}</div>,
    span: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLSpanElement>>) => 
      <span data-testid="motion-span" {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock the data import
vi.mock('../../../dictonary/data.json', () => ({
  default: {
    title: 'Mock Title',
    herosction: {
      tagline: 'Mock Tagline Exposed. Second part of tagline.',
    },
  },
}));

// Mock the EcoScanUploader component
vi.mock('../../buttons/EcoScanUploader', () => ({
  default: () => <div data-testid="eco-scan-uploader">Mock EcoScanUploader</div>,
}));

describe('HeroSection', () => {
  it('renders the title correctly', () => {
    render(<HeroSection />);
    const titleElement = screen.getByText('Mock Title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('font-black', 'uppercase', 'knewave-regular');
  });

  it('renders the tagline correctly', () => {
    render(<HeroSection />);
    const taglineText = screen.getByText((content) =>
      content.includes('Mock Tagline Exposed.') && content.includes('Second part of tagline.')
    );
    expect(taglineText).toBeInTheDocument();
  });

  it('renders the EcoScanUploader component', () => {
    render(<HeroSection />);
    const ecoScanUploader = screen.getByTestId('eco-scan-uploader');
    expect(ecoScanUploader).toBeInTheDocument();
  });

  it('applies correct classes to the main container', () => {
    render(<HeroSection />);
    const mainContainers = screen.getAllByTestId('motion-div');
    expect(mainContainers[0]).toHaveClass('justify-center', 'items-center', 'rounded-[25px]', 'm-2');
  });
});