import { store } from "./store";
import type { Toast, ToastOptions } from "./types";
import { defaultConfig } from "./config";

const uid = () => crypto.randomUUID();

export function toast(options: ToastOptions) {
  const merged = {
    ...defaultConfig,
    ...options
  };

  const hasActions = merged.actions && merged.actions.length > 1;
  const autoDuration = hasActions ? 0 : 3000;

  const t: Toast = {
    id: uid(),
    title: merged.title ?? "",
    message: merged.message,
    type: merged.type ?? "default",
    theme: merged.theme ?? "light",
    position: merged.position ?? "bottom-center",
    duration: merged.duration ?? autoDuration,
    pauseOnHover: merged.pauseOnHover ?? true,
    pauseOnWindowBlur: merged.pauseOnWindowBlur ?? true,
    closable: merged.closable ?? true,
    className: merged.className ?? "",
    showIcon: merged.showIcon ?? true, // Padrão: mostrar ícone
    showProgress: merged.showProgress ?? true,
    createdAt: Date.now(),
    actions: options.actions ?? [],
    onDismiss: merged.onDismiss,
    onShow: merged.onShow
  };

  store.add(t);

  return {
    dismiss: () => store.remove(t.id),
    update: (newOptions: Partial<ToastOptions>) => {
      store.update(t.id, newOptions);
    }
  };
}
