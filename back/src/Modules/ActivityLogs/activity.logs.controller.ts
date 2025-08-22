import { Controller, Get, Query } from '@nestjs/common';
import { ActivityService } from './activity-logs.service';

@Controller('activity')
export class ActivityLogsController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('activity-feed')
  async getActivityFeed(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.activityService.findAll(page, limit);
  }
}
