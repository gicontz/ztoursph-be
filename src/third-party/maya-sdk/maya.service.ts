/*********************************************************
 * AWS S3 Object Class Typescript File - Revision History
 *********************************************************
 *     Date    *       Author    * Description of Changes
 *********************************************************
 * 12/09/2022  * Gim Contillo    * Initial Change
*********************************************************/
import config from '@config/config';
import { TResponseData } from 'src/http.types';
import axios from 'axios';

export type TMayaPayment = {
    totalAmount: {
        value: number;
        currency: string;
    },
    requestReferenceNumber: string;
}

export class MayaService {
    private cnfg =  config();
    private FACE_API_KEY = '';
    private SECRET_KEY = ''; 
    private CHECKOUT_API = '';

    constructor() {
        this.FACE_API_KEY = this.cnfg.maya.faceApi;
        this.SECRET_KEY = this.cnfg.maya.secretKey;
        this.CHECKOUT_API = this.cnfg.maya.checkoutApi;
    }

    public async checkout(data?: TMayaPayment): Promise<TResponseData | null> {
        const headers = {
            authorization: `Basic ${Buffer.from(this.FACE_API_KEY).toString('base64')}`,
        };
        
        try {
            const checkoutRequest = await axios.post(this.CHECKOUT_API, data, { headers });
            return {
                status: checkoutRequest.status,
                message: checkoutRequest.statusText,
                data: checkoutRequest.data
            }
        } catch (e) {
            return {
                message: e,
                status: e.response.status,
            }
        }
    }
}
