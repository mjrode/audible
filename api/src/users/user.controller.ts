// import {
//   Controller,
//   Get,
//   Param,
//   ParseIntPipe,
//   Post,
//   UsePipes,
//   ValidationPipe,
//   Body,
//   Delete,
//   Patch,
//   Query,
// } from '@nestjs/common';
// import { UserService } from './user.service';
// import { User } from './user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
// import { GetUsersFilterDto } from './dto/get-users-filter.dto';

// @Controller('users')
// export class UserController {
//   constructor(private userService: UserService) {}

//   @Get()
//   async getUsers(
//     @Query(ValidationPipe) filterDto: GetUsersFilterDto,
//   ): Promise<User[]> {
//     return this.userService.getUsers(filterDto);
//   }

//   @Get('/:id')
//   async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
//     return this.userService.getUserById(id);
//   }

//   @Post()
//   @UsePipes(ValidationPipe)
//   createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
//     return this.userService.createUser(createUserDto);
//   }

//   @Delete('/:id')
//   remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
//     return this.userService.deleteUser(id);
//   }

//   @Patch('/:id/name')
//   updateUserName(
//     @Param('id', ParseIntPipe) id: number,
//     @Body('name') name: string,
//   ): Promise<User> {
//     return this.userService.updateUserName(id, name);
//   }
// }
