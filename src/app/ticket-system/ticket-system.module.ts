import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketBookingComponent } from './ticket-booking/ticket-booking.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [TicketBookingComponent],
  exports: [TicketBookingComponent],
})
export class TicketSystemModule { }