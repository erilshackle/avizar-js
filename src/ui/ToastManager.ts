import { store } from "../core/store";
import type { Toast } from "../core/types";
import { createToastElement } from "./ToastItem";
import "./styles.css";

class ToastManager {
  private containers: Map<string, HTMLElement> = new Map();
  private elementsMap: Map<string, HTMLElement> = new Map();

  constructor() { this.init(); }

  private init() {
    store.subscribe((toasts: Toast[]) => this.render(toasts));
  }

  private getContainer(position: string): HTMLElement {
    if (!this.containers.has(position)) {
      const el = document.createElement("div");
      el.className = `avizar-container ${position}`;
      document.body.appendChild(el);
      this.containers.set(position, el);
    }
    return this.containers.get(position)!;
  }

  private render(toasts: Toast[]) {
    const currentIds = new Set(toasts.map(t => t.id));

    // 1. Remover quem saiu (com animação tratada no ToastItem)
    this.elementsMap.forEach((el, id) => {
      if (!currentIds.has(id)) {
        // A animação de saída já é disparada pelo ToastItem chamando store.remove
        // Mas se a store for limpa externamente, garantimos aqui:
        if (!el.classList.contains('avizar-exit')) {
          el.remove();
          this.elementsMap.delete(id);
        }
      }
    });

    // 2. Adicionar apenas NOVOS toasts
    toasts.forEach((t) => {
      if (!this.elementsMap.has(t.id)) {
        const container = this.getContainer(t.position);
        const el = createToastElement(t);
        this.elementsMap.set(t.id, el);

        // Lógica de empilhamento:
        // Se for bottom, o novo entra em baixo (append)
        // Se for top, o novo entra em cima (prepend)
        if (t.position.startsWith('top')) {
          container.prepend(el);
        } else {
          container.appendChild(el);
        }
      }
    });
  }
}

let instance: ToastManager | null = null;
export function initToastUI() {
  if (!instance) instance = new ToastManager();
  return instance;
}