import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CaslAbilityService } from './casl/casl-ability/casl-ability.service';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, PostsModule, CaslModule],
  controllers: [],
  providers: [CaslAbilityService],
})
export class AppModule {}
