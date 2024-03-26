export class TPDFItenerary {
  readonly firstname: string;
  readonly middleInitial?: string;
  readonly lastname: string;
  readonly age: number;
  readonly nationality: string;
  readonly email: string | undefined;
  readonly mobileNumber1: number;
  readonly mobileNumber2: number;
  readonly booking_date: string;
  readonly guests?: {
    name: string;
    age: number;
    nationality: string;
  }[];
  readonly booked_tours?: {
    id: string | number;
    category: 'tours' | 'packages';
    pax: number;
    date: string;
    time: string;
    description: string;
    subtotal: string;
  }[];
}
