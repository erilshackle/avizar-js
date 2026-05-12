import { toast } from "./core/toast";
import { initToastUI } from "./ui/ToastManager";
import { setupConfig } from "./core/config";
import { store } from "./core/store";
import type { ToastOptions, ToastType, ToastAction } from "./core/types";

if (typeof window !== "undefined") {
    initToastUI();
}

type ActionOrActions = ToastAction | ToastAction[];

function createAvizarHelper(type: ToastType, op?: Partial<ToastOptions>) {
    return (
        arg1: string,
        arg2?: string | Partial<ToastOptions> | ActionOrActions,
        arg3?: ActionOrActions | Partial<ToastOptions>
    ) => {
        let title = "";
        let message = "";
        let options: Partial<ToastOptions> = { ...op };

        // Lógica inteligente de argumentos
        if (typeof arg2 === "string") {
            title = arg1;
            message = arg2;
            // Trata o terceiro argumento como Actions ou Options
            if (Array.isArray(arg3)) options.actions = arg3;
            else if (arg3 && 'button' in arg3) options.actions = [arg3 as ToastAction];
            else if (arg3) options = { ...options, ...(arg3 as Partial<ToastOptions>) };
        } else {
            message = arg1;
            // Trata o segundo argumento como Actions ou Options
            if (Array.isArray(arg2)) options.actions = arg2;
            else if (arg2 && 'button' in arg2) options.actions = [arg2 as ToastAction];
            else if (arg2) options = { ...options, ...(arg2 as Partial<ToastOptions>) };
        }

        return toast({ ...options, title, message, type });
    };
}

export const Avizar = {
    show: createAvizarHelper("default"),
    success: createAvizarHelper("success"),
    error: createAvizarHelper("error"),
    warning: createAvizarHelper("warning"),
    info: createAvizarHelper("info"),
    custom: toast,
    config: setupConfig, // Método para configuração default
    clearAll: () => store.clearAll(),
};

export default Avizar;