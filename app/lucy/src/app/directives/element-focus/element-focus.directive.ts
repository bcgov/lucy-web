import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appElementFocus]'
})
export class ElementFocusDirective implements OnInit {
  
  constructor(private ref: ElementRef) { }

  @Input() setFocus: boolean;

  ngOnInit(): void {
    if (this.setFocus) {
      this.ref.nativeElement.focus();
    }
  }

}
