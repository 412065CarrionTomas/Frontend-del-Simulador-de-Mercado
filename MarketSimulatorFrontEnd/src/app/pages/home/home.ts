import { Component, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }

  onImageHover(isHovering: boolean) {
    const header = this.document.querySelector('app-header');
    if (header) {
      if (isHovering) {
        this.renderer.addClass(header, 'blur-effect');
      } else {
        this.renderer.removeClass(header, 'blur-effect');
      }
    }
  }
}