import {Response} from '@angular/http';

/**
 * Class to be used in `mockError` function to accept Response object
 */
export class ErrorResponse extends Response implements Error {
  name: any;
  message: any;
}
