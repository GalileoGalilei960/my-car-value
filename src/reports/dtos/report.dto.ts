import { Expose, Transform } from 'class-transformer';
import { Report } from '../reports.entity';

export class ReportDto {
    @Expose()
    approved: boolean;

    @Expose()
    make: string;

    @Expose()
    model: string;

    @Expose()
    year: number;

    @Expose()
    mileage: number;

    @Expose()
    lng: number;

    @Expose()
    lat: number;

    @Expose()
    price: number;

    @Transform(({ obj }: { obj: Report }) => obj.user.id)
    @Expose()
    userId: number;
}
