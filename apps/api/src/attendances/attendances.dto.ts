import { ClaimSeatInput } from '@badabing/shared';
import { IsUUID } from 'class-validator';

export class ClaimSeatDto implements ClaimSeatInput {
  @IsUUID()
  userId: string;
}