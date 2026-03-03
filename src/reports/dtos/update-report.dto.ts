import {
    IsLatitude,
    IsLongitude,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class UpdateReportDto {
    @IsOptional()
    @IsString()
    make: string;

    @IsOptional()
    @IsString()
    model: string;

    @IsOptional()
    @IsNumber()
    @Min(1885)
    @Max(new Date().getFullYear())
    year: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    mileage: number;

    @IsOptional()
    @IsLongitude()
    lng: number;

    @IsOptional()
    @IsLatitude()
    lat: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price: number;
}
