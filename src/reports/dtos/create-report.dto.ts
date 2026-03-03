import {
    IsLatitude,
    IsLongitude,
    IsNumber,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class CreateReportDto {
    @IsString()
    make: string;

    @IsString()
    model: string;

    @IsNumber()
    @Min(1885)
    @Max(new Date().getFullYear())
    year: number;

    @IsNumber()
    @Min(0)
    mileage: number;

    @IsLongitude()
    lng: number;

    @IsLatitude()
    lat: number;

    @IsNumber()
    @Min(0)
    price: number;
}
