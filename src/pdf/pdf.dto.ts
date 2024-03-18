export type TPDFItenerary = {
    guest: {
        name: string;
        lead_guest: boolean;
        age: number;
        nationality: string;
    }[];
    email: string | undefined
    contact: number
    tour_date: string;
    eta: string
    etd: string
    booked_tours: {
        date: string;
        time: string
        description: string;
        subtotal: string;
    }[]
}