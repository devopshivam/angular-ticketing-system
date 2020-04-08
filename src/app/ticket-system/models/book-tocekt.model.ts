//Array of seats
export class BookTicketResponseModel{
  public type: string;
  public seats: BusSeatInfoModel[];
}

//Model for seat
export class BusSeatInfoModel {
  public seatNo: number;
  public status: string;
}