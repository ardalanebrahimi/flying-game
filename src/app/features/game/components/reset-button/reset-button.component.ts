import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-reset-button',
  templateUrl: './reset-button.component.html',
  styleUrls: ['./reset-button.component.scss'],
})
export class ResetButtonComponent {
  @Output() reset = new EventEmitter<void>();

  onClickReset(): void {
    this.reset.emit();
  }
}
