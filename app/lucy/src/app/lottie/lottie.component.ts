import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-lottie',
  templateUrl: './lottie.component.html',
  styleUrls: ['./lottie.component.css']
})
export class LottieComponent implements OnInit {

  ready = false;
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed = 1;

  private _path = 'https://assets2.lottiefiles.com/datafiles/qq04nAXfKjPV6ju/data.json';
  private _loop = true;
  private _autoPlay = true;

  @Input() path(url: string) {
    this._path = url;
    console.log(`set path`);
    this.initIcon();
  }

  @Input() autoPlay(value: boolean) {
    this._autoPlay = value;
    this.initIcon();
  }

  @Input() loop(value: boolean) {
    this._loop = value;
    console.log(`set loop`);
    this.initIcon();
  }

  constructor() {
    this.initIcon();
  }

  ngOnInit() {
  }

  initIcon() {
    if (!this._path || !this._loop) {
      return;
    }
    console.log(`showing lottie`);
    this.lottieConfig = {
      path: this.path,
      renderer: 'canvas',
      autoplay: this._autoPlay,
      loop: this._loop
    };
    this.ready = true;
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  stop() {
    this.anim.stop();
  }

  play() {
    this.anim.play();
  }

  pause() {
    this.anim.pause();
  }

  setSpeed(speed: number) {
    this.animationSpeed = speed;
    this.anim.setSpeed(speed);
  }
}
