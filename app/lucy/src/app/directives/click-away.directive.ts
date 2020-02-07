import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[clickAway]'
})
export class ClickAwayDirective {

  constructor(private ref: ElementRef) { }

  @Output()
  public clickAway = new EventEmitter();

  @HostListener('document:click', ['$event'])
  public onClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const clickedInside = this.ref.nativeElement.contains(targetElement);
    let targetId;

    targetId = targetElement.id;
    if (!targetId) {
      targetId = targetElement.parentElement.id;
    }
    
    // Check if the click was outside the element
    // The variable `targetId` is used to avoid onClick events on the parent element
    if (targetElement && !clickedInside && !(targetId === 'clickAwayParent')) {
      this.clickAway.emit(event);
    }
  }
}
