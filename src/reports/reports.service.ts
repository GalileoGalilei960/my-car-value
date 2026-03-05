import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) {}
    async findAll() {
        return this.repo.find();
    }

    async findById(id: number) {
        const report = await this.repo.findOneBy({ id });

        if (!report)
            throw new NotFoundException(`Report with id ${id} does not exist`);

        return report;
    }

    async create(report: CreateReportDto, user: CreateUserDto) {
        const newReport = this.repo.create(Object.assign(report, { user }));

        await this.repo.save(newReport);

        return newReport;
    }

    async update(id: number, attrs: Partial<Report>) {
        const report = await this.repo.findOneBy({ id });

        if (!report)
            throw new NotFoundException(`Report with id ${id} does not exist`);

        Object.assign(report, attrs);

        return this.repo.save(report);
    }

    async delete(id: number) {
        const report = await this.findById(id);

        await this.repo.delete(id);

        return report;
    }
}
