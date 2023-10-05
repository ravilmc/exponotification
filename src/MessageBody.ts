import {
  ArrayMinSize,
  IsArray,
  IsJSON,
  IsOptional,
  IsString,
} from 'class-validator';

export class MessageBody {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  @IsJSON()
  @IsOptional()
  data?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  recipients: string[];
}
