import { Module, Global } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AlertService } from './alert.service';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
    imports: [PrismaModule],
    providers: [AuditService, AlertService],
    exports: [AuditService, AlertService],
})
export class CommonModule { }
