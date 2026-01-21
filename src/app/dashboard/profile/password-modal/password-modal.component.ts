import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { ToastService } from '../ui/toast.service';

@Component({
  selector: 'app-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-modal.component.html'
})
export class PasswordModalComponent {
  current = '';
  password = '';
  confirm = '';
  loading = false;

  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  private profileService = inject(ProfileService);
  private toastService = inject(ToastService);

  closeModal() {
    this.close.emit();
  }

  async submit() {
    if (!this.current || !this.password || !this.confirm) {
      this.toastService.show('Todos los campos son obligatorios', 'error');
      return;
    }

    if (this.password !== this.confirm) {
      this.toastService.show('Las contraseñas no coinciden', 'error');
      return;
    }

    try {
      this.loading = true;

      await this.profileService.updatePassword({ current_password: this.current, password: this.password, password_confirmation: this.confirm });

      this.toastService.show('Contraseña actualizada', 'success');
      this.updated.emit(); 
      this.closeModal();
    } catch (error) {
      this.toastService.show('Error al actualizar contraseña', 'error');
    } finally {
      this.loading = false;
    }
  }
}
