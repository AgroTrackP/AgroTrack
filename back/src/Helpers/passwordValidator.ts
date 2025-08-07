import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

export const validatePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<void> => {
  const isValid = await bcrypt.compare(plainPassword, hashedPassword);
  if (!isValid) {
    throw new UnauthorizedException('Invalid credentials.');
  }
};
