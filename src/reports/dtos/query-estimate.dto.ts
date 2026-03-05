import { Transform } from 'class-transformer';
import {
    IsLatitude,
    IsLongitude,
    IsNumber,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class QueryEstimate {
    @IsString()
    make: string;

    @IsString()
    model: string;

    @Transform(({ value }) => parseInt(value as string))
    @IsNumber()
    @Min(1885)
    @Max(new Date().getFullYear())
    year: number;

    @Transform(({ value }) => parseInt(value as string))
    @IsNumber()
    @Min(0)
    mileage: number;

    @Transform(({ value }) => parseFloat(value as string))
    @IsLongitude()
    lng: number;

    @Transform(({ value }) => parseFloat(value as string))
    @IsLatitude()
    lat: number;
}
