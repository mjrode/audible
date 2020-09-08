// import { Injectable, NotFoundException } from '@nestjs/common';
// import { UserRepository } from './user.repository';
// import { InjectRepository } from '@nestjs/typeorm';
// import { CreateUserDto } from './dto/create-user.dto';
// import { User } from './user.entity';
// import { GetUsersFilterDto } from './dto/get-users-filter.dto';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(UserRepository)
//     private userRepository: UserRepository,
//   ) {}

//   async getUserById(id: number) {
//     const found = await this.userRepository.findOne(id);
//     if (!found) {
//       throw new NotFoundException(`User with ID "${id}" not found`);
//     }
//     return found;
//   }

//   async createUser(createUserDto: CreateUserDto) {
//     return this.userRepository.createUser(createUserDto);
//   }

//   async deleteUser(id: number): Promise<void> {
//     const result = await this.userRepository.delete(id);
//     if (result.affected === 0) {
//       throw new NotFoundException(`User with ID ${id} not found`);
//     }
//   }

//   async getUsers(filterDto: GetUsersFilterDto) {
//     return this.userRepository.getUsers(filterDto);
//   }

//   async updateUserName(id: number, name: string): Promise<User> {
//     const user = await this.getUserById(id);
//     user.name = name;
//     await user.save();
//     return user;
//   }
// }
