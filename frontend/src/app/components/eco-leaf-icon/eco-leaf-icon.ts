import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-eco-leaf-icon',
  standalone: true,
  imports: [],
  templateUrl: './eco-leaf-icon.html',
  styleUrl: './eco-leaf-icon.css',
})
export class EcoLeafIcon {
  @Input() className = 'h-8 w-8';
}
