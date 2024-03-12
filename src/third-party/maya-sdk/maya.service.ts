/*********************************************************
 * AWS S3 Object Class Typescript File - Revision History
 *********************************************************
 *     Date    *       Author    * Description of Changes
 *********************************************************
 * 12/09/2022  * Gim Contillo    * Initial Change
*********************************************************/
import config from '@config/config';
import { HttpStatus } from '@nestjs/common';
import { TResponseData } from 'src/http.types';
var MayaSDK = require("paymaya-node-sdk");

export type TFile = {
    bucketname: string;
    fieldname: string;
    buffer: Buffer;
    filename: string;
    mimetype: string;
}

export class MayaService {
    private maya = MayaSDK.PaymayaSDK;
    private mayaCheckout = MayaSDK.Checkout;

    private cnfg =  config();
    constructor() {
        this.maya.initCheckout(
            this.cnfg.maya.faceApi,
            this.cnfg.maya.secretKey,
            this.maya.ENVIRONMENT.SANDBOX
        )
    }

    public async checkout(): Promise<TResponseData> {
    var YOUR_REQUEST_REFERENCE_NUMBER = "123456789";

    var Contact = MayaSDK.Contact;
    var Address = MayaSDK.Address;
    var Buyer = MayaSDK.Buyer;
    var ItemAmountDetails = MayaSDK.ItemAmountDetails;
    var ItemAmount = MayaSDK.ItemAmount;
    var Item = MayaSDK.Item;
    
    var addressOptions = {
          line1 : "9F Robinsons Cybergate 3",
          line2 : "Pioneer Street",
          city : "Mandaluyong City",
          state : "Metro Manila",
          zipCode : "12345",
          countryCode : "PH"
    };
    
    var contactOptions = {
         phone : "+63(2)1234567890",
         email : "paymayabuyer1@gmail.com"
    };
    
    var buyerOptions = {
        firstName : "John",
        middleName : "Michaels",
        lastName : "Doe",
        contact: null,
        shippingAddress: null,
        billingAddress: null,
    };
        
    var contact = new Contact();
    contact.phone = contactOptions.phone;
    contact.email = contactOptions.email;
    buyerOptions.contact = contact;
    
    var address = new Address();
    address.line1 = addressOptions.line1;
    address.line2 = addressOptions.line2;
    address.city = addressOptions.city;
    address.state = addressOptions.state;
    address.zipCode = addressOptions.zipCode;
    address.countryCode = addressOptions.countryCode;
    buyerOptions.shippingAddress = address;
    buyerOptions.billingAddress = address;
              
    /**
    * Construct buyer here
    */
    var buyer = new Buyer();
    buyer.firstName = buyerOptions.firstName;
    buyer.middleName = buyerOptions.middleName;
    buyer.lastName = buyerOptions.lastName;
    buyer.contact = buyerOptions.contact;
    buyer.shippingAddress = buyerOptions.shippingAddress;
    buyer.billingAddress = buyerOptions.billingAddress;
    
    
    var itemAmountDetailsOptions = {
        shippingFee: "14.00",
        tax: "5.00",
        subTotal: "50.00" 
    };
    
    var itemAmountOptions = {
        currency: "PHP",
        value: "69.00",
        details: "",
    };
    
    var itemOptions = {
        name: "Leather Belt",
        code: "pm_belt",
        description: "Medium-sv",
        amount: null,
        totalAmount: null,
    };
    
    var itemAmountDetails = new ItemAmountDetails();
    itemAmountDetails.shippingFee = itemAmountDetailsOptions.shippingFee;
    itemAmountDetails.tax = itemAmountDetailsOptions.tax;
    itemAmountDetails.subTotal = itemAmountDetailsOptions.subTotal;
    itemAmountOptions.details = itemAmountDetails;
    
    var itemAmount = new ItemAmount();
    itemAmount.currency = itemAmountOptions.currency;
    itemAmount.value = itemAmountOptions.value;
    itemAmount.details = itemAmountOptions.details;
    itemOptions.amount = itemAmount;
    itemOptions.totalAmount = itemAmount;
    
    /**
    * Contruct item here
    */
    var item = new Item();
    item.name = itemOptions.name;
    item.code = itemOptions.code;
    item.description = itemOptions.description;
    item.amount = itemOptions.amount;
    item.totalAmount = itemOptions.totalAmount;
    
    // Add all items here
    var items = [];
    items.push(item);
    
    var checkout = new this.mayaCheckout();
    checkout.buyer = buyer;
    checkout.totalAmount = itemOptions.totalAmount;
    checkout.requestReferenceNumber = YOUR_REQUEST_REFERENCE_NUMBER;
    checkout.items = items;
    
    const result = await checkout.execute(function (error, response) {
        if (error) {
            // handle error
            return { status: HttpStatus.BAD_REQUEST, message: error };
        } else {
            // track response.checkoutId
            return { status: HttpStatus.ACCEPTED, message: 'Payment Accepted!', data: response };
        }
    });

    return result;
    }
}