import { Module } from '@nestjs/common';
import { KycController } from 'src/kyc/kyc.controller';
import { KycService } from 'src/kyc/kyc.service';

@Module({
    controllers: [KycController],
    providers: [KycService],
})
export class KycModule { }
