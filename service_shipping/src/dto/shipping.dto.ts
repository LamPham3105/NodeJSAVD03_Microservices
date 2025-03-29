import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsDate,
  IsEnum,
} from 'class-validator';

export class CreateShippingDto {
  @IsInt()
  @IsNotEmpty()
  order_id: number;

  @IsString()
  @IsOptional()
  tracking_number?: string;

  @IsString()
  @IsOptional()
  carrier?: string;

  @IsDate()
  @IsOptional()
  estimated_delivery?: Date;

  @IsString()
  @IsOptional()
  delivery_status?: string;
}

export class UpdateShippingDto {
  @IsString()
  @IsOptional()
  tracking_number?: string;

  @IsString()
  @IsOptional()
  carrier?: string;

  @IsDate()
  @IsOptional()
  estimated_delivery?: Date;

  @IsString()
  @IsOptional()
  delivery_status?: string;
}
