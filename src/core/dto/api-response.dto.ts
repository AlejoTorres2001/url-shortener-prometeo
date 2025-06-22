import { ApiProperty } from '@nestjs/swagger';
import { DateUtils } from '../utils/date.utils';

export class ApiResponseDto<T> {
  @ApiProperty({ required: true })
  success: boolean;
  @ApiProperty({ required: true })
  message: string;
  @ApiProperty({ required: true })
  data?: T;
  @ApiProperty({ required: true })
  errorCode?: string;
  @ApiProperty({ required: true })
  timestamp: string;

  constructor(success: boolean, message: string, data?: T, errorCode?: string) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errorCode = errorCode;
    this.timestamp = DateUtils.formatDateToUTC(new Date());
  }
}
export function createApiResponse<T>(
  success: boolean,
  message: string,
  data?: T,
  errorCode?: string,
): ApiResponseDto<T> {
  return new ApiResponseDto(success, message, data, errorCode);
}
