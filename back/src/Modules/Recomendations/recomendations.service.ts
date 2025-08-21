import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Recommendation } from './entities/recomendations.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Recommendation)
    private readonly repo: Repository<Recommendation>,
  ) {}

  async findByCropType(cropType: string): Promise<Recommendation> {
    const rec = await this.repo.findOne({
      where: { crop_type: cropType },
      relations: [
        'recommended_diseases',
        'recommended_products',
        'recommended_application_type',
        'recommended_products.category',
      ],
    });

    if (!rec) {
      throw new Error(`No se encontró recomendación para ${cropType}`);
    }

    return rec;
  }
}
