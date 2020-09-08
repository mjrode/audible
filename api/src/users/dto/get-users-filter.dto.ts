import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
export class GetUsersFilterDto {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
