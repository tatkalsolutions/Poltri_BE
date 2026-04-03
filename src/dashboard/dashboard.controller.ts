import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Public } from 'src/auth/Public';

@Controller('dashboard')
export class DashboardController {

    constructor(
        private readonly dashboardService: DashboardService,
    ) { }

    @Get('getTodayTotalBird')
    async getTodayTotalBird() {
        return await this.dashboardService.getTodayTotalBird();
    }

    @Get('getTodayTotalFeedStock')
    async getTodayTotalFeedStock() {
        return await this.dashboardService.getTodayTotalFeedStock();
    }

    @Get('getTotalEggs')
    async getTotalEggs() {
        return await this.dashboardService.getTotalEggs();
    }

    @Get('getTotalTodaysSale')
    async getTotalTodaysSale() {
        return await this.dashboardService.getTotalTodaysSale();
    }
    @Public()
    @Get('getEggProductionAnalytics')
    async getEggProductionAnalytics() {
        return await this.dashboardService.getEggProductionAnalytics();
    }
}
