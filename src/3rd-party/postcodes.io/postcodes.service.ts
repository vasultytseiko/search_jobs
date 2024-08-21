import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PostcodeInfo } from './postcodes.interface';

@Injectable()
export class PostcodesService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Looks up a postal code and returns the result.
   * @param postcode - The postal code to look up
   * @returns The result from the postcodes.io API
   */
  async lookupPostcode(postcode: string): Promise<PostcodeInfo> {
    if (!postcode) {
      throw new HttpException(
        'Postal code is required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = await this.httpService.axiosRef.get(
      `https://api.postcodes.io/postcodes/${postcode}`,
    );

    if (!response.data?.result) {
      throw new HttpException(
        `Couldn't find the UK postcode provided.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return response.data.result as PostcodeInfo;
  }

  /**
   * Checks if the postcode is of UK format.
   * @param {string} postcode - The postal code to validate
   * @returns True if the postcode is of UK format, otherwise false.
   */
  async validatePostcode(postcode: string): Promise<boolean> {
    if (!postcode) {
      throw new HttpException(
        'Postal code is required.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const response = await this.httpService.axiosRef.get(
      `https://api.postcodes.io/postcodes/${postcode}/validate`,
    );

    return response.data.result;
  }

  calculateDistance(
    geoPoint1: { longitude: number; latitude: number },
    geoPoint2: { longitude: number; latitude: number },
  ) {
    const { longitude: lon1, latitude: lat1 } = geoPoint1;
    const { longitude: lon2, latitude: lat2 } = geoPoint2;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180; // Convert degrees to radians
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }
}
