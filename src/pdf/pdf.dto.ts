export class TPDFItenerary {
  readonly firstName: string;
  readonly middleInitial?: string;
  readonly lastName: string;
  readonly suffix: NameSuffix;
  readonly age: number;
  readonly nationality: string;
  readonly email: string | undefined;
  readonly mobileNumber1: number;
  readonly mobileNumber2: number;
  readonly booking_date: string;
  readonly guests?: { [tourId: string | number]: TGuest[] };
  readonly booked_tours?: {
    id: string | number;
    category: 'tours' | 'packages';
    pax: number;
    date: string;
    pickup_time: string;
    description: string;
    subtotal: string;
  }[];
}

export type TGuest = {
  id: string;
  firstName: string;
  lastName: string;
  middleInitial: string;
  suffix: NameSuffix;
  age: number;
  nationality: string;
};

enum NameSuffix {
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
