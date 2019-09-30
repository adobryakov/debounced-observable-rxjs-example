import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CountdownComponent} from '../countdown/countdown.component';

const TIME_INIT_VALUE = 1;
const TIME_CLEAR_VALUE = 5;

@Component({
  selector: 'app-debounced',
  templateUrl: './debounced.component.html',
  styleUrls: ['./debounced.component.scss']
})
export class DebouncedComponent implements OnInit {


  // Subject of waiting for input (waiting until value is not changes for TIME_INIT_VALUE seconds)
  private valueStabled: Subject<string> = new Subject<string>();

  // Countdown waiting for input as a tip
  @ViewChild('countdownStabilization', { static: false })
  private countdownStabilization: CountdownComponent;


  // Subject of stabilisation value (after input value is still actual for TIME_CLEAR_VALUE seconds)
  private valueDisappear: Subject<string> = new Subject<string>();

  // Countdown waiting for disappearing value as a tip
  @ViewChild('countdownDisappear', { static: false })
  private countdownDisappear: CountdownComponent;


  /* Input value properties */

  // value bind to the input field
  public inputValue: string;

  // Value we display in a tip, if needed
  public inputValueToDisplay: string;

  constructor() {
    this.inputValue = '';
    this.inputValueToDisplay = '';
  }

  /**
   * Initialization of data subscriptions
   */
  ngOnInit() {
    console.log('ngOnInit 1');
    this.valueStabled
      .pipe(
        // wait TIME_INIT_VALUE seconds after the last event before emitting last event
        debounceTime(TIME_INIT_VALUE * 1000),
        // only emit if value is different from previous value
        distinctUntilChanged()
      )
      .subscribe( value => this.valueChangeProcess(value));

    this.valueDisappear
      .pipe(
        // wait TIME_CLEAR_VALUE until calling valueDisappearProcess
        debounceTime(TIME_CLEAR_VALUE * 1000)
      )
      .subscribe(() => this.valueDisappearProcess());
  }

  /**
   * Method called if model changes
   * Here we are waiting for inputValue is changed by user
   */
  public inputValueChanged(): void {
    console.log('inputValueChanged');
    this.inputValueToDisplay = '';
    this.valueStabled.next(this.inputValue);
    this.countdownStabilization.start(1);
  }

  /**
   * Method used in a subscription of input is done (non-touching value for some time)
   */
  private valueChangeProcess(value): void {
    console.log('valueChangeProcess');
    // We now can display value in a tip
    this.inputValueToDisplay = value;

    // Emit value stabilization event
    this.valueDisappear.next(value);

    // Start countdown
    this.countdownDisappear.start(5);
  }

  /**
   * Method uses in subscription of value is ready dto disappear (input is processed and time time passed)
   */
  private valueDisappearProcess(): void  {
    console.log('valueDisappearProcess');
    // We now should remove value from the tip
    this.inputValueToDisplay = '';

    // Clearing the input field (here we use two-way binding, so input field will be also cleared)
    this.inputValue = '';
  }
}
