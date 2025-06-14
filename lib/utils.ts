import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string | undefined, startChars = 4, endChars = 4): string {
  if (!address) return ""
  if (address.length <= startChars + endChars) return address

  const start = address.substring(0, startChars)
  const end = address.substring(address.length - endChars)

  return `${start}...${end}`
}
