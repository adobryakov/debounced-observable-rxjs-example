import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

/**
 * Component displaying countdown information
 */
@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {

  @Input()
  private caption: string;

  private timeLeft: number;

  private valueStabled: Subject<number> = new Subject<number>();

  constructor() {
    this.timeLeft = 0;
  }

  /**
   * Method is used for
   * timeout - time to wait, seconds
   */
  public start(timeout: number) {
    if (timeout <= 0) {
      return;
    }
    this.timeLeft = timeout;
    this.ticTak();
  }

  /**
   * Downsizing inner timer until time is up
   */
  private switchTimeout() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.ticTak();
    }
  }

  /**
   * Emits an inner timeout switchig event
   */
  private ticTak() {
    this.valueStabled.next(this.timeLeft);
  }

  /**
   * Initialization of subscription
   */
  ngOnInit() {
    this.valueStabled
      .pipe(debounceTime(1000))
      .subscribe( () => this.switchTimeout());
  }

  /**
   * Unsubscribing events to avoid memory leaks
   */
  ngOnDestroy(): void {
    this.valueStabled.unsubscribe();
  }

}
