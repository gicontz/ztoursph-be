export class TPDFItenerary {
  readonly bookingId: string;
  readonly referenceNumber: string;
  readonly firstName: string;
  readonly middleInitial?: string;
  readonly lastName: string;
  readonly suffix: NameSuffix;
  readonly birthday: string;
  readonly nationality: string;
  readonly email: string | undefined;
  readonly mobileNumber1: string;
  readonly mobileNumber2: string;
  readonly booking_date: string;
  readonly guests?: { [key: string]: TGuest[] };
  readonly booked_tours?: {
    id: string | number;
    category: 'tours' | 'packages';
    pax: number;
    date: string;
    pickup_time: string;
    participants: string[];
    title: string;
    subtotal: string;
  }[];
  readonly fees: number;
  readonly grandTotal: number;
}

export type TGuest = {
  id: string;
  name: string;
  age: number;
  nationality: string;
};

export enum NameSuffix {
  None = '',
  Jr = 'Jr',
  Sr = 'Sr',
  II = 'II',
  III = 'III',
  IV = 'IV',
  V = 'V',
  VI = 'VI',
  VII = 'VII',
  VIII = 'VIII',
  IX = 'IX',
  X = 'X',
  XI = 'XI',
  XII = 'XII',
  XIII = 'XIII',
  XIV = 'XIV',
  XV = 'XV',
  XVI = 'XVI',
  XVII = 'XVII',
  XVIII = 'XVIII',
  XIX = 'XIX',
  XX = 'XX',
  XXI = 'XXI',
  XXII = 'XXII',
  XXIII = 'XXIII',
  XXIV = 'XXIV',
}

export type TPDFMeta = {
  bucketname: string;
  filename: string;
  buffer: Buffer;
  mimetype: string;
};
