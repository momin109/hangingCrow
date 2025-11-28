import { IsNotEmpty, IsString, IsNumber, IsUUID, Min } from 'class-validator';

export class PlaceBetDto {
    @IsString()
    @IsNotEmpty()
    marketId: string;

    @IsString()
    @IsNotEmpty()
    selectionId: string;

    @IsNumber()
    @Min(1.01)
    odds: number;

    @IsNumber()
    @Min(10) // Minimum stake example
    stake: number;
}
