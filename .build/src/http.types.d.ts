import { HttpStatus } from "@nestjs/common";
export type TResponseData = {
    status: HttpStatus;
    data?: any;
    message: string;
};
