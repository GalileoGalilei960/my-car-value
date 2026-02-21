import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from './users.service';
import { GetUserByEmailDto } from 'src/dtos/get-user-by-email-query.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';

@Controller('auth')
export class UsersController {
    constructor(private userService: UsersService) {}
    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    async signUp(@Body() body: CreateUserDto) {
        const user = await this.userService.create(body.email, body.password);

        return user;
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/:id')
    async getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    async getUserByEmail(@Query() query: GetUserByEmailDto) {
        return this.userService.find(query.email);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Delete('/:id')
    async deleteUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Patch('/:id')
    async updateUserById(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateUserDto,
    ) {
        return this.userService.update(id, body);
    }
}
