import type { ToastOptions } from "./types";

// Valores iniciais padrão
export const defaultConfig: Partial<ToastOptions> = {
  duration: 3000,
  position: "bottom-right",
  theme: "auto",
  pauseOnHover: true,
  pauseOnWindowBlur: true,
  closable: true,
  showIcon: true,
  showProgress: true
};

export const setupConfig = (options: Partial<ToastOptions>) => {
  Object.assign(defaultConfig, options);
};