import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
    constructor(private userService: UsersService) {}
    @Post()
    async signUp(@Body() body: CreateUserDto) {
        const user = await this.userService.createUser(
            body.email,
            body.password,
        );

        return user;
    }
}
