import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateReportDto } from './dtos/update-report.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { QueryEstimate } from './dtos/query-estimate.dto';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}
    @Get()
    getAllReports() {
        return this.reportsService.findAll();
    }

    @Get('estimate')
    getEstimate(@Query() query: QueryEstimate) {
        return this.reportsService.estimate(query);
    }

    @Get('/:id')
    getReportById(@Param('id') id: number) {
        return this.reportsService.findById(id);
    }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(
        @Body() body: CreateReportDto,
        @CurrentUser() user: CreateUserDto,
    ) {
        const report = this.reportsService.create(body, user);

        return report;
    }

    @Patch('/:id')
    updateReport(@Param('id') id: number, @Body() attrs: UpdateReportDto) {
        return this.reportsService.update(id, attrs);
    }

    @UseGuards(AdminGuard)
    @Patch('approve/:id')
    approveReport(@Param('id') id: number, @Body() approval: ApproveReportDto) {
        return this.reportsService.update(id, approval);
    }

    @Delete('/:id')
    deleteReport(@Param('id') id: number) {
        return this.reportsService.delete(id);
    }
}
