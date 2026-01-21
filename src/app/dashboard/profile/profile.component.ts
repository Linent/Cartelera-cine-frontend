import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from './profile.service';
import { UserProfile } from './models/user-profile.model';
import { Genre } from './models/genre.model';
import { GENRE_ICONS } from './genre-icons';
import { ToastService } from './ui/toast.service';
import { PasswordModalComponent } from './password-modal/password-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PasswordModalComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user?: UserProfile;
  genres: Genre[] = [];
  selected = new Set<number>();
  icons = GENRE_ICONS;
  loading = true;
  showPasswordModal = false;

  // Inyectores modernos
  private profileService = inject(ProfileService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  async ngOnInit(): Promise<void> {
    try {
      this.loading = true;
      const [profile, genresData] = await Promise.all([
        this.profileService.getProfile(),
        this.profileService.getGenres()
      ]);

      this.user = profile;
      this.genres = genresData;

      if (profile && profile.genres) {
        profile.genres.forEach(g => this.selected.add(g.id));
      }
    } catch (error) {
      this.toastService.show('Error cargando el perfil', 'error');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  // 👈 ESTA ES LA FUNCIÓN QUE FALTABA
  onPasswordUpdated() {
    console.log('Contraseña actualizada correctamente');
    this.showPasswordModal = false;
    // Aquí podrías cerrar sesión o pedir re-login si el backend lo requiere
  }

  openPasswordModal() {
    this.showPasswordModal = true;
  }

  closePasswordModal() {
    this.showPasswordModal = false;
  }

  toggleGenre(id: number): void {
    this.selected.has(id) ? this.selected.delete(id) : this.selected.add(id);
  }

  isSelected(id: number): boolean {
    return this.selected.has(id);
  }

  async save(): Promise<void> {
    try {
      await this.profileService.updatePreferences([...this.selected]);
      this.toastService.show('Preferencias guardadas correctamente', 'success');
    } catch {
      this.toastService.show('Error al guardar preferencias', 'error');
    }
  }
}
