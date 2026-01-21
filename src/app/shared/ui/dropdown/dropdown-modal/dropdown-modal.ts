import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownOption } from '../dropdown-option.model';

@Component({
  selector: 'app-dropdown-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-modal.component.html',
  styleUrls: ['./dropdown-modal.css']
})
export class DropdownModalComponent {

  @Input() options: DropdownOption[] = [];
  @Input() value = '';

  @Output() select = new EventEmitter<DropdownOption>();
  @Output() close = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
