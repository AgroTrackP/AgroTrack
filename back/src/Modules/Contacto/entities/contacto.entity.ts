import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('contact')
export class Contact {
  @ApiProperty({
    example: '3a2b1c4d-5e6f-7g8h-9i10-jklmnopqrst',
    description: 'ID único del mensaje de contacto',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'b91f8c7d-2e44-4f91-9d1b-123456789abc',
    description: 'ID del usuario autenticado (opcional, si existe relación)',
    required: false,
  })
  @Column({ nullable: true })
  userId?: string;

  @ApiProperty({
    example: 'Problema con mi pedido',
    description: 'Título breve del mensaje',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  title: string;

  @ApiProperty({
    example: 'cliente@mail.com',
    description: 'Correo electrónico de contacto',
    maxLength: 150,
  })
  @Column({ type: 'varchar', length: 150 })
  email: string;

  @ApiProperty({
    example: 'Tengo un problema con el producto que recibí, viene dañado.',
    description: 'Descripción detallada del mensaje',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    example: '2025-08-25T15:34:12.000Z',
    description: 'Fecha en que se creó el mensaje',
  })
  @CreateDateColumn()
  createdAt: Date;
  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
}
