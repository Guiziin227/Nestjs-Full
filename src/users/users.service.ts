import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CaslAbilityService } from '../casl/casl-ability/casl-ability.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private abilityService: CaslAbilityService) {}

  create(createUserDto: CreateUserDto) {

    const ability = this.abilityService.ability

    if(!ability.can('create', 'User')){
      throw new UnauthorizedException('Unauthorized to create user')
    }

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: bcrypt.hashSync(createUserDto.password, 10),
      },
    });
  }

  findAll() {

    const ability = this.abilityService.ability

    if(!ability.can('read', 'User')){
      throw new UnauthorizedException('Unauthorized to read users')
    }

    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
