import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ErrorHandler } from 'src/utils/ErrorHandler';

@Injectable()
export class EsendexService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Sends a message to the user(s)
   * @param userNumbers Phone numbers of the user(s) to send the message to
   * @param message The message to be sent to the user(s)
   * @returns The response from the Esendex API
   */
  async send(userNumbers: string[] | string, message: string) {
    // Ignore the messages sending to the user if it's not a production environment
    if (process.env.NODE_ENV !== 'production') {
      // Imitate the response from the Esendex API
      return {
        batch: {
          batchid: 'fake-batch-id',
        },
      };
    }

    try {
      if (typeof userNumbers === 'string') {
        userNumbers = [userNumbers];
      }

      if (!userNumbers.length) {
        throw new HttpException(
          'User phone numbers are required.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!message) {
        throw new HttpException(
          'SMS message is required.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const messages = this.createMessages(userNumbers, message);

      const response = await this.httpService.axiosRef.post(
        'https://api.esendex.com/v1.0/messagedispatcher',
        {
          accountreference: process.env.ESENDEX_ACCOUNT_REF,
          messages,
        },
        {
          auth: {
            username: process.env.ESENDEX_REG_EMAIL,
            password: process.env.ESENDEX_API_PASS,
          },
        },
      );

      return response.data;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  /**
   * Logs into the Esendex API and returns the session id
   * @returns The session id
   */
  async login() {
    try {
      const response = await this.httpService.axiosRef.post(
        'https://api.esendex.com/v1.0/session/constructor',
        {
          accountreference: process.env.ESENDEX_ACCOUNT_REF,
        },
        {
          auth: {
            username: process.env.ESENDEX_REG_EMAIL,
            password: process.env.ESENDEX_API_PASS,
          },
        },
      );

      return response.data.id;
    } catch (error) {
      ErrorHandler(error);
    }
  }

  /**
   * Re-format the userNumbers and message to the required format for the Esendex API
   * @param userNumbers The phone numbers of the users to send the message to
   * @param message The message to be sent to the user
   * @returns An array of objects containing the user numbers and the message
   */
  private createMessages(userNumbers: string[], message: string) {
    return userNumbers.map((number) => {
      return {
        to: number,
        body: message,
      };
    });
  }
}
