import { Component, OnInit, Input } from '@angular/core';
import { ToastModel, ToastIconType, ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  private displaySeconds = 2;

  private dirmissDurationInSeconds = 0.5;
  private get timeout(): number {
    return (this.displaySeconds * 1000) + (this.dirmissDurationInSeconds * 1000);
  }
  private get displayTime(): number {
    return this.timeout - (this.dirmissDurationInSeconds * 1000);
  }

  presenting = true;

  private _model: ToastModel;
  get model(): ToastModel {
    return this._model;
  }
  @Input()
  set model(model: ToastModel) {
     this._model = model;
     if (this.model) {
      this.beginTimeout();
     }
   }

  get iconType(): string {
    if (this.model && this.model.icon !== undefined) {
      return ToastIconType[this.model.icon];
    } else {
      return ToastIconType[ToastIconType.none]
    }
  }

  get isSuccess(): boolean {
    if (this.model && this.model.icon !== undefined) {
      return this.model.icon === ToastIconType.success;
    } 
  }

  get isFailure(): boolean {
    if (this.model && this.model.icon !== undefined) {
      return this.model.icon === ToastIconType.fail;
    } 
  }

  constructor(private toastService: ToastService) { }

  ngOnInit() {
  }

  async beginTimeout() {
    this.presenting = true;
    this.beginDismissAnimationTimer();
    this.beginDismissTimer();
  }

  async beginDismissAnimationTimer() {
    await this.wait(this.displayTime);
    this.presenting = false;
  }
  async beginDismissTimer() {
    await this.wait(this.timeout);
    if (this.model) {
      this.toastService.clear(this.model);
    }
  }

   /**
   * Create a delay
   * @param ms milliseconds
   */
  private wait(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
