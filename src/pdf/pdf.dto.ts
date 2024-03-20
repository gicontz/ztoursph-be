export type TPDFItenerary = {
    firstname: string,
    middleInitial?: string,
    lastname: string,
    age: number,
    nationality: string
    email: string | undefined
    mobileNumber1: number,
    mobileNumber2: number,
    tour_date: string; 
    guests?: {
        name: string;
        age: number;
        nationality: string;
    }[]
    booked_tours?: {
        pax: number;
        date: string;
        time: string
        description: string;
        subtotal: string;
    }[]
}