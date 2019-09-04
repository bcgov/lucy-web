import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorService, ErrorModel } from 'src/app/services/error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit, OnDestroy {

  get title(): string {
    if (this.current) {
      return this.current.title;
    } else {
      return ``;
    }
  }

  get body(): string {
    if (this.current) {
      return this.current.body;
    } else {
      return ``;
    }
  }
  get current(): ErrorModel {
    return this.errorService.current;
  }

  constructor(private errorService: ErrorService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.errorService.current = undefined;
  }

}
