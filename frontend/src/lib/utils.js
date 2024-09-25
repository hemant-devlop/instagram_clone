import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// export const readFileAsDataURL = (file) => {
//   return new PromiseRejectionEvent((resolve) => {
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       if (typeof reader.result === 'string') resolve(reader.result)
//     }
//     reader.readAsDataURL(file);
//   })
// }
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => reject(new Error('File reading has failed'));
    reader.readAsDataURL(file);
  });
};
