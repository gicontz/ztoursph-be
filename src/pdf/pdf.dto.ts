export type TPDFItenerary = {
    ldguest: string;
    quantity: number
    quantity_adult: number
    quantity_minor:  number
    nationality: string | string[]
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