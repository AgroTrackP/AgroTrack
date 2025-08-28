import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationPlans } from '../ApplicationPlans/entities/applicationplan.entity';
import { Status } from '../ApplicationPlans/status.enum';
import { MailService } from '../nodemailer/mail.service';
import { rememberHtml } from '../nodemailer/templates/rememberProduct.html';
import { RecommendationsService } from '../Recomendations/recomendations.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    @InjectRepository(ApplicationPlans)
    private readonly appPlanRepo: Repository<ApplicationPlans>,
    private readonly mailerService: MailService,
    private readonly recommendationsService: RecommendationsService,
  ) {}

  // Ejemplo de una tarea programada que se ejecuta cada minuto
  @Cron('0 5 * * *')
  async handleCron() {
    this.logger.debug('Tarea programada ejecutada cada dia a la 5 AM');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const plantationPlan = await this.appPlanRepo.find({
      where: { status: Status.PENDING, planned_date: tomorrow },
      relations: ['user', 'items', 'items.product', 'plantation'],
    });
    console.log(plantationPlan[0], 'planificaciones pendientes');

    if (plantationPlan.length === 0) {
      this.logger.debug('No hay planes pendientes.');
      return;
    }

    // ✅ Iterar sobre cada plan y enviar un correo
    for (const plan of plantationPlan) {
      try {
        const recommendations =
          await this.recommendationsService.findByCropType(
            plan.plantation.crop_type,
          );
        console.log(recommendations, 'recomendaciones');
        await this.mailerService.sendMail(
          plan.user.email,
          'recordatorio de aplicación de producto',
          rememberHtml({
            name: plan.user.name,
            planned: `${plan.planned_date as unknown as string}`,
            plantationName: plan?.plantation?.name || 'Tu plantación',
            productName:
              plan.items?.map((item) => item.product.name)?.join(', ') ||
              'Producto no especificado',
            recommended_water_per_m2: recommendations
              ? recommendations.recommended_water_per_m2.toString()
              : '0',
          }),
        );
        this.logger.log(`Recordatorio enviado a ${plan.user.email}`);
      } catch (error) {
        this.logger.error(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `Error al enviar correo a ${plan.user.email}: ${error.message}`,
        );
      }
    }
  }
}
