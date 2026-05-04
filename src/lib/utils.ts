import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFileUrl(path: string | undefined): string {
  if (!path) return '';
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
  // ensure no double slashes
  return `${baseUrl}/${path}`.replace(/([^:]\/)\/+/g, "$1");
}
