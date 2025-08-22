import { Injectable, NotFoundException } from '@nestjs/common'; // <-- Agrega NotFoundException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recommendation } from './entities/recomendations.entity';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Recommendation)
    private readonly repo: Repository<Recommendation>,
  ) {}

  async findByCropType(cropType: string) {
    const rec = await this.repo.findOne({
      where: { crop_type: cropType },
      relations: [
        'recommended_diseases',
        'recommended_products',
        'recommended_application_type',
      ],
    });

    if (!rec) {
      throw new NotFoundException(
        `No se encontró recomendación para el cultivo: ${cropType}`,
      );
    }

    return rec;
  }
}
