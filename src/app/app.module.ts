import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { DebouncedComponent } from './debounced/debounced.component';
import {CountdownModule} from 'ngx-countdown';
import { CountdownComponent } from './countdown/countdown.component';

@NgModule({
  declarations: [
    AppComponent,
    DebouncedComponent,
    CountdownComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

    FormsModule,

    AppRoutingModule,
    RouterModule.forRoot([
      { path: '', component: DebouncedComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
