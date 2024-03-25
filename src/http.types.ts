/*********************************************************
 * HTTP Types File - Revision History
 *********************************************************
 *     Date    *       Author    * Description of Changes
 *********************************************************
 * 12/09/2022  * Gim Contillo    * Initial Change
 *********************************************************/
import { HttpStatus } from '@nestjs/common';

export type TResponseData = {
  status: HttpStatus;
  data?: any;
  message: string;
};
