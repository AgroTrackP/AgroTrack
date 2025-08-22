import { Controller, Get, Param } from '@nestjs/common';
import { RecommendationsService } from './recomendations.service';
import { RecommendationDto } from './dtos/recomendations.dto';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get(':cropType')
  async getByCrop(
    @Param('cropType') cropType: string,
  ): Promise<RecommendationDto> {
    return this.recommendationsService.findByCropType(cropType);
  }
}
