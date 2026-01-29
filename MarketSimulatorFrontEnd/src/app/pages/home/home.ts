import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
// import { Component, Renderer2, Inject } from '@angular/core';
// import { DOCUMENT } from '@angular/common';

// @Component({
//   selector: 'app-home',
//   imports: [],
//   templateUrl: './home.html',
//   styleUrl: './home.scss',
// })
// export class Home {
//   constructor(
//     private renderer: Renderer2,
//     @Inject(DOCUMENT) private document: Document
//   ) { }

//   onImageHover(isHovering: boolean) {
//     const header = this.document.querySelector('app-header');
//     if (header) {
//       if (isHovering) {
//         this.renderer.addClass(header, 'blur-effect');
//       } else {
//         this.renderer.removeClass(header, 'blur-effect');
//       }
//     }
//   }
// }