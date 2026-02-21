import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from './users.service';
import { GetUserByEmailDto } from 'src/dtos/get-user-by-email-query.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private userService: UsersService) {}
    @Post()
    async signUp(@Body() body: CreateUserDto) {
        const user = await this.userService.create(body.email, body.password);

        return user;
    }

    @Get('/:id')
    async getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }

    @Get()
    async getUserByEmail(@Query() query: GetUserByEmailDto) {
        return this.userService.find(query.email);
    }

    @Delete('/:id')
    async deleteUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id);
    }

    @Patch('/:id')
    async updateUserById(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateUserDto,
    ) {
        return this.userService.update(id, body);
    }
}
