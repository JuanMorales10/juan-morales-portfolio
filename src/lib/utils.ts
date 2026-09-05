import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Une clases y resuelve conflictos de Tailwind.
 *
 * Es la firma estándar de shadcn: los componentes traídos del catálogo de
 * 21st.dev (Aceternity, Magic UI, Motion Primitives) la importan de acá tal
 * cual, así que no se puede cambiar sin tocarlos a todos.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
