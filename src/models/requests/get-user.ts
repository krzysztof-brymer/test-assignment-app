import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetUser {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
