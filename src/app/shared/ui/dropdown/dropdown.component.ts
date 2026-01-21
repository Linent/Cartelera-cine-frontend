import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownOption } from './dropdown-option.model';
import { DropdownModalComponent } from './dropdown-modal/dropdown-modal';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, DropdownModalComponent],
  templateUrl: './dropdown.component.html'
})
export class DropdownComponent {

  @Input() options: DropdownOption[] = [];
  @Input() value = '';
  @Input() placeholder = 'Seleccionar';
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<string>();

  open = false;
  showModal = false;

  get isMobile(): boolean {
    return window.innerWidth < 768;
  }

  toggle() {
    if (this.disabled) return;

    if (this.isMobile) {
      this.showModal = true;
    } else {
      this.open = !this.open;
    }
  }

  select(option: DropdownOption) {
    if (this.disabled) return;

    this.value = option.value;
    this.valueChange.emit(option.value);
    this.open = false;
    this.showModal = false;
  }

  closeModal() {
    this.showModal = false;
  }

  get selectedLabel(): string {
    const found = this.options.find(o => o.value === this.value);
    return found ? found.label : this.placeholder;
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    if (this.disabled || this.isMobile) return;

    const target = event.target as HTMLElement;
    if (!target.closest('app-dropdown')) {
      this.open = false;
    }
  }
}
