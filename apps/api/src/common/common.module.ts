import { Global, Module } from '@nestjs/common';
import { AuthorizationService } from './authz/authorization.service';
import { AuthGuard } from './guards/auth.guard';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [AuthorizationService, AuthGuard],
  exports: [AuthorizationService, AuthGuard]
})
export class CommonModule {}
