import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CaslAbilityService } from '../casl/casl-ability/casl-ability.service';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService,
              private abilityService: CaslAbilityService) {}

  create(createPostDto: CreatePostDto & { authorId: string }) {

    const ability = this.abilityService.ability

    if(!ability.can('create', 'Post')){
      throw new Error('Unauthorized to create post')
    }

    return this.prisma.post.create({
      data: createPostDto,
    });
  }

   findAll() {

    const ability = this.abilityService.ability

    const posts =  this.prisma.post.findMany({
      where:{
        AND: [accessibleBy(ability, 'read').Post]
      }
    });
    return posts
  }

  findOne(id: string) {

    const ability = this.abilityService.ability
    return this.prisma.post.findUnique({
      where: { id,
        AND: [accessibleBy(ability, 'read').Post]
      },
    });
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  remove(id: string) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
