import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name } = createUserDto;
    const user = new User();
    user.name = name;
    await user.save();
    return user;
  }

  async getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    const { name, search } = filterDto;
    const query = this.createQueryBuilder('user');
    if (name) {
      query.andWhere('user.name = :name', { name });
    }

    if (search) {
      query.andWhere('user.name ILIKE :search', { search: `%${search}%` });
    }
    const users = await query.getMany();
    return users;
  }
}
