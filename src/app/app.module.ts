import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { TicketSystemModule } from './ticket-system/ticket-system.module';


@NgModule({
  imports:      [ BrowserModule, FormsModule , TicketSystemModule],
  declarations: [ AppComponent, HelloComponent  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
