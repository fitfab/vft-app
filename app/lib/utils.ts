import { Cloudinary } from "@cloudinary/url-gen";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cld = new Cloudinary({ cloud: { cloudName: "dcvxv60gw" } });
