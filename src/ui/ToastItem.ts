import type { Toast } from "../core/types";
import { store } from "../core/store";

export function createToastElement(toast: Toast): HTMLElement {
  const el = document.createElement("div");
  
  const themeClass = `avizar-${toast.theme || 'auto'}`;
  
  // Define se é Pill ou Glass baseado na className
  const isPill = toast.className?.includes('pill');
  const variantClass = isPill ? 'avizar-pill' : 'avizar-glass';
  
  el.className = `avizar-toast ${variantClass} ${themeClass} ${toast.type} ${toast.className || ""}`;
  el.setAttribute("role", "alert");

  // Estrutura interna otimizada
  el.innerHTML = `
    <div class="avizar-inner">
      ${toast.showIcon ? `<div class="avizar-icon">${getIcon(toast.type)}</div>` : ''}
      
      <div class="avizar-body">
        ${toast.title ? `<h4 class="avizar-title">${toast.title}</h4>` : ''}
        <div class="avizar-message">${toast.message}</div>
        
        ${toast.actions.length > 0 ? `
          <div class="avizar-actions">
            ${toast.actions.map((action, i) => `
              <button class="avizar-btn ${action.className || ''}" data-index="${i}">
                ${action.button}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>

      ${toast.closable ? `<button class="avizar-close" aria-label="Close">&times;</button>` : ''}
    </div>
    ${toast.duration > 0 && toast.showProgress ? `<div class="avizar-progress"></div>` : ''}
  `;

  // Lógica de Temporizador e Progresso
  let remaining = toast.duration;
  let start = Date.now();
  let timerId: number;
  let rafId: number;

  const progressBar = el.querySelector('.avizar-progress') as HTMLElement;

  const cleanup = () => {
    clearTimeout(timerId);
    cancelAnimationFrame(rafId);
  };

  const pause = () => {
    if (toast.duration <= 0) return;
    remaining -= Date.now() - start;
    cleanup();
  };

  const resume = () => {
    if (toast.duration <= 0) return;
    start = Date.now();
    timerId = window.setTimeout(() => dismiss(el, toast.id), remaining);
    
    const updateProgress = () => {
      const elapsed = Date.now() - start;
      const progress = Math.max(0, (remaining - elapsed) / toast.duration);
      if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
      rafId = requestAnimationFrame(updateProgress);
    };
    rafId = requestAnimationFrame(updateProgress);
  };

  // Listeners de Pausa
  if (toast.pauseOnHover) {
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
  }

  // Inicializar
  if (toast.duration > 0) resume();

  // Eventos de Botões
  el.querySelector('.avizar-close')?.addEventListener('click', () => dismiss(el, toast.id));
  
  el.querySelectorAll('.avizar-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt((e.target as HTMLElement).dataset.index!);
      toast.actions[idx].onClick(toast.id);
      dismiss(el, toast.id);
    });
  });

  // Entrada
  requestAnimationFrame(() => el.classList.add('avizar-enter'));

  return el;
}

function dismiss(el: HTMLElement, id: string) {
  el.classList.add('avizar-exit');
  el.addEventListener('animationend', () => store.remove(id), { once: true });
}

function getIcon(type: string) {
  // SVGs embutidos para evitar dependências de fontes
  const icons: Record<string, string> = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    default: ``
  };
  return icons[type] || icons.info;
}