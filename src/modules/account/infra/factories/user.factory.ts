import { Combine, ID } from '@inpro-labs/core';
import { UserModel } from '@modules/account/infra/db/models/user.model';
import { User } from '@modules/account/domain/aggregates/user.aggregate';
import { Email } from '@modules/account/domain/value-objects/email.value-object';

export class UserToDomainAdapter {
  adaptOne(item: UserModel): User {
    const { id, email, verified, createdAt, updatedAt, password } = item;

    const [userId, userEmail] = Combine([
      ID.create(id),
      Email.create(email),
    ]).unwrap();

    return User.create({
      id: userId,
      email: userEmail,
      verified,
      createdAt,
      updatedAt,
      password,
    }).unwrap();
  }

  adaptMany(items: UserModel[]): User[] {
    return items.map((item) => this.adaptOne(item));
  }
}
