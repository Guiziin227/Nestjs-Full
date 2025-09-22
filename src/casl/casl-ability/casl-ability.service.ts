import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Post, Roles, User } from 'generated/prisma';

export type PermAction = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type PermResource = Subjects<{ User: User; Post: Post }> | 'all';

export type AppAbility = PureAbility<[PermAction, PermResource]>;

export type DefinePermissions = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void;

const rolePermissionsMap: Record<Roles, DefinePermissions> = {
  ADMIN: (user, { can }) => {
    can('manage', 'all'); //pode fazer tudo em qualquer recurso
  },
  EDITOR: (user, { can }) => {
    can('create', 'Post');
    can('read', 'Post');
    can('update', 'Post');
  },
  READER: (user, { can }) => {
    can('read', 'Post', { published: true });
  },
  WRITER: (user, { can }) => {
    can('create', 'Post');
    can('read', 'Post');
    can('update', 'Post', { authorId: user.id });
  },
};

@Injectable()
export class CaslAbilityService {
  ability: AppAbility;

  createForUser(user: User) {
    const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);
    rolePermissionsMap[user.role](user, builder);
    this.ability = builder.build();
    return this.ability;
  }
}
