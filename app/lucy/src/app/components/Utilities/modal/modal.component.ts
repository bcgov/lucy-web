import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Output() onBackdropClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  public onClickAway(): void {
    this.onBackdropClick.emit();
  }

}
