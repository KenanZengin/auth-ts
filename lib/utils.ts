import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) { // dinamik class vermek için kullanırız
  return twMerge(clsx(inputs))
}
