import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommissionService } from 'src/commission/commission.service';

@Module({
    imports: [PrismaModule],
    providers: [CommissionService],
    exports: [CommissionService],
})
export class CommissionModule { }
