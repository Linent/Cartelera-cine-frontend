import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastData } from './toast.model';


@Injectable({ providedIn: 'root' })
export class ToastService {
  private toast$ = new BehaviorSubject<ToastData>({ message: '', type: 'success', show: false });
  public toastState = this.toast$.asObservable();

  show(message: string, type: 'success' | 'error' = 'success') {
    this.toast$.next({ message, type, show: true });

    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
      this.toast$.next({ ...this.toast$.value, show: false });
    }, 3000);
  }
}
