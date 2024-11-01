import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveUserProfileDto {
  @IsNotEmpty()
  @IsString()
  publicId: string;
}
