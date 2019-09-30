import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebouncedComponent } from './debounced.component';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import {CountdownComponent} from '../countdown/countdown.component';

/**
 * Combined method to check both, inputValue and inputValueToDisplay
 *
 * @param component
 * @param expectedValue
 * @param expectedValueDisplayed
 */
const inputValuesExpections = (component: DebouncedComponent, expectedValue: string, expectedValueDisplayed: string) => {

  console.log('iEx', component.inputValue, component.inputValueToDisplay);
  // inputValue must be still the same
  expect(component.inputValue).toEqual(expectedValue);

  // Input value must be displayed now
  expect(component.inputValueToDisplay).toEqual(expectedValueDisplayed);
};

describe('DebouncedComponent', () => {

  const EMPTY_STRING = '';

  let originalTimeout;

  let component: DebouncedComponent;
  let fixture: ComponentFixture<DebouncedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ DebouncedComponent, CountdownComponent ]
    })
    .compileComponents();
  }));

  afterEach(() => {
    jasmine.clock().uninstall();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    jasmine.clock().install();

    fixture = TestBed.createComponent(DebouncedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('Straight input', () => {
    const testInput = '777';

    component.inputValue = testInput;
    component.inputValueChanged();

    console.log('inputValue', component.inputValue, component.inputValueToDisplay);
    fixture.detectChanges();

    // inputValue must be still the same, not displaying yet
    inputValuesExpections(component, testInput, EMPTY_STRING);

    // Wait for 500ms, nothing should be changed
    jasmine.clock().tick(500);
    fixture.detectChanges();

    inputValuesExpections(component, testInput, EMPTY_STRING);

    console.log('0.5 seconds left', component.inputValue, component.inputValueToDisplay);

    // Wait for 500ms more
    jasmine.clock().tick(500);
    fixture.detectChanges();
    console.log('1 seconds left', component.inputValue, component.inputValueToDisplay);

    // inputValue must be still the same
    // Input value must be displayed now
    inputValuesExpections(component, testInput, testInput);

    // Wait for 5000 seconds to have inputValue cleared
    jasmine.clock().tick(2000);
    jasmine.clock().tick(3000);
    fixture.detectChanges();
    console.log('6 seconds left', component.inputValue, component.inputValueToDisplay);

    // inputValue must be still the same
    // Not displaying anymore
    inputValuesExpections(component, EMPTY_STRING, EMPTY_STRING);

    jasmine.clock().tick(1000);
    fixture.detectChanges();

    // inputValue must be still the same
    // Not displaying anymore
    inputValuesExpections(component, EMPTY_STRING, EMPTY_STRING);

    console.log('7 seconds left', component.inputValue, component.inputValueToDisplay);
  });

  it('Concurrent input', () => {
    const testInput1 = 'first input';
    const testInput2 = 'second input';

    component.inputValue = testInput1;
    component.inputValueChanged();

    console.log('inputValue', component.inputValue, component.inputValueToDisplay);
    fixture.detectChanges();

    // inputValue must be still the same, not displaying yet
    console.log('1');
    inputValuesExpections(component, testInput1, EMPTY_STRING);

    jasmine.clock().tick(4000);

    // After 4 seconds we mst be on the middle of disappearing process
    // Now, if we change the value, all steps above should be forgotten
    component.inputValue = testInput2;
    component.inputValueChanged();

    console.log('2');
    inputValuesExpections(component, testInput2, EMPTY_STRING);
    jasmine.clock().tick(1000);
    console.log('3');
    inputValuesExpections(component, testInput2, testInput2);
    jasmine.clock().tick(4000);
    console.log('4');
    inputValuesExpections(component, testInput2, testInput2);
    jasmine.clock().tick(1000);
    console.log('5');
    inputValuesExpections(component, EMPTY_STRING, EMPTY_STRING);
  });
});
