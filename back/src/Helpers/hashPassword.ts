import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hash: string = await bcrypt.hash(password, 10);
    return hash;
  } catch (error) {
    throw new BadRequestException(`Error creating user. Error: ${error}`);
  }
};
