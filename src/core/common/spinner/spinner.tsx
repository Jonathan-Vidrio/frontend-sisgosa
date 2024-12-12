'use client';

import React, { useRef, useEffect } from 'react';
import { useUiStore } from '@/store';
import './spinner.css';

let lastRotation = 0;

/**
 * @function Spinner
 * @description Spinner component that displays a rotating animation to indicate loading
 *
 * @param {Object} props - Component properties
 * @param {'sm' | 'md' | 'lg'} [props.size] - Size of the spinner (small, medium, large)
 * @param {string} [props.color] - Color of the spinner
 * @param {string} [props.className] - Additional CSS classes for the spinner
 * @returns {JSX.Element | null} Rendered Spinner component or null if not loading
 *
 * @example
 * <Spinner size="md" color="red" className="my-spinner" />
 */
export const Spinner = ({ size, color, className }: { size?: 'sm' | 'md' | 'lg'; color?: string; className?: string }): JSX.Element | null => {
  const { isLoading } = useUiStore(state => state);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      // Calculamos el incremento de rotación (360 grados en 1000ms)
      lastRotation += (360 / 1000) * deltaTime;
      if (spinnerRef.current) {
        spinnerRef.current.style.transform = `rotate(${lastRotation % 360}deg)`;
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isLoading) {
      previousTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isLoading]);

  // Siempre renderizamos el spinner, pero controlamos su visibilidad
  return (
    <div
      ref={spinnerRef}
      className={`spinner ${!isLoading ? 'hidden' : ''} ${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'} ${
        color ? `border-[${color}]` : 'border-blue-500'
      } border-t-4 border-solid rounded-full ${className}`}
    ></div>
  );
};
