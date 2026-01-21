import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="(toastService.toastState | async) as toast"
         [class]="toast.show ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 pointer-events-none'"
         class="fixed bottom-10 left-1/2 -translate-x-1/2 z-100 transition-all duration-300 transform">

      <div [ngClass]="toast.type === 'success' ? 'bg-zinc-900 border-green-500/50' : 'bg-zinc-900 border-red-500/50'"
           class="flex items-center gap-3 px-6 py-3 rounded-2xl border bg-opacity-90 backdrop-blur-xl shadow-2xl">

        <svg *ngIf="toast.type === 'success'" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        
        <svg *ngIf="toast.type === 'error'" class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>

        <span class="text-white font-medium text-sm">{{ toast.message }}</span>
      </div>
    </div>
  `
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
