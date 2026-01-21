import { Component } from '@angular/core';

@Component({
  selector: 'app-chart-icon',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3 17l6-6 4 4 7-7"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M14 7h7v7"
      />
    </svg>
  `
})
export class ChartIconComponent {}
