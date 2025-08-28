import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

export const validatePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<void> => {
  const isValid = await bcrypt.compare(plainPassword, hashedPassword);
  if (!isValid) {
    throw new BadRequestException('Invalid credentials.');
  }
};
