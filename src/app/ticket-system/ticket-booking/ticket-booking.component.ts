import { Component, OnInit } from '@angular/core';
import { BookTicketResponseModel, BusSeatInfoModel } from '../models/book-tocekt.model';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { mockResponse } from './ticket-booking-system-response';

@Component({
  selector: 'ticket-booking',
  templateUrl: './ticket-booking.component.html',
  styleUrls: ['./ticket-booking.component.css']
})
export class TicketBookingComponent implements OnInit {
  public bookingInfo: BookTicketResponseModel;
  public bookingForm: FormGroup;
  public availablseats: BusSeatInfoModel[] = [];
  public flag: boolean = true;
  public error: string;
  public res: any;

  constructor(private fb: FormBuilder) {
    this.initateForm(); //load the form on main screen for user input
  }

  ngOnInit() {
    this.bookingInfo = mockResponse; //fetch mock data for seats
    this.availablseats = this.getAvailablseats(); //retrieve list of available seats from mock data
  }

  private initateForm(): void {
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      count: ['', Validators.required]
    });
  }

  //On submitting form check for validations and start seat booking
  public onSubmit(formValues: FormGroup): void {
    const userName: string = formValues.controls.name.value;
    const requiredSeats: number = parseInt(formValues.controls['count'].value);
    if (requiredSeats > 7 ){
      this.error = "Only 7 seats can be booked at a time."
    }else if (requiredSeats < 1 ){
      this.error = "Seats required mus be greater than zero"
    }else if (requiredSeats > this.availablseats.length) {
      this.error = "required seats not available";
    } else if (requiredSeats > 0) {
      this.startBooking(userName, requiredSeats);
    }

  }

  public openBookingForm(): void {
    this.bookingForm.setValue({
      name: '',
      count: ''
    });
    this.flag = true;
    this.error = '';
  } 

  //Retrieve list of available seats
  private getAvailablseats(): BusSeatInfoModel[] {
    let availablseats: BusSeatInfoModel[] = []
    this.bookingInfo.seats.forEach(seat => {
      if (seat.status === 'available') {
        availablseats.push(seat);
      }
    });
    return availablseats;
  }

  //Check if seats are available and alot them
  private startBooking(name: string, count: number): void {
    let busModel: BusSeatInfoModel[] = [];
    busModel = this.checkForSeats(this.availablseats,name, count);
      if (busModel.length !== 0) {
        this.bookSeat(busModel, name);
      }else{
        this.error = "Booking couldn't be made";
      }
  }

  //set selected seats status to booked
  private bookSeat(bookseats: BusSeatInfoModel[], name: string): void {
    //for each selected seat find  corresponding entry in mock data and change status to booked and name of bookie
    bookseats.forEach(seat => {
      const index: number = this.bookingInfo.seats.findIndex(data => data.seatNo === seat.seatNo); 
      this.bookingInfo.seats[index].status = "booked";
      this.bookingInfo.seats[index].bookedBy = name;
    });

    this.availablseats = this.getAvailablseats();

    this.flag = false;
  }


  private checkForSeats(availableSeatsArray: BusSeatInfoModel[],name: string, count: number): BusSeatInfoModel[] {
    let bookseats: BusSeatInfoModel[] = [];
    //select seats from all available seats
    availableSeatsArray.forEach(seat => {
      if (bookseats.length < count) {
        bookseats.push(seat);
        if (bookseats.length === count && count > 1) {
          //if required seats are found available, check if they are in same row or not
          bookseats = this.chekIfSameRow(bookseats);
        }
      }
    });
    if (bookseats.length !== count){
      //if not all seats are in same row, iterate again for remaining seats with leftout available seats
      var uniqueavailableSeats = availableSeatsArray.filter(function(obj) {
        return !bookseats.some(function(obj2) {
          return obj.seatNo == obj2.seatNo;
        });
      });
      //recursively call checkForSeats function untill required number of seats are not found
      bookseats = bookseats.concat(this.checkForSeats(uniqueavailableSeats,name,count-bookseats.length));
    }
    return bookseats;
  }

  private chekIfSameRow(bookseats: BusSeatInfoModel[]): BusSeatInfoModel[] {
    let row: number[] = [];
    let rownum ;
    //check the row number of seat and store in temporary array
    bookseats.forEach(seat => {
      rownum = (seat.seatNo % 7 !== 0) ? Math.floor(seat.seatNo/7 + 1) : seat.seatNo/7;
      row.push(rownum);
    })
    //check if seats are from multiple rows
    if (Array.from(new Set(row)).length === 1) {
      return bookseats;
    } else {
      //eliminate seats from starting to find seats in later rows
      const removeIndex = row.findIndex(data => data === rownum)
      const removeElement = bookseats.slice(removeIndex);

      return removeElement;
    }
  }

}