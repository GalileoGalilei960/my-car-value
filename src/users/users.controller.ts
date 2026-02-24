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
    Session,
    UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from './users.service';
import { GetUserByEmailDto } from 'src/users/dtos/get-user-by-email-query.dto';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from 'src/guards/auth.guard';

export interface SecureSession {
    userId?: number | null;
}

@Controller('auth')
@Serialize(UserDto)
export default class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService,
    ) {}

    @Get('whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User | null) {
        console.log(user);

        return user;
    }

    @Get('signout')
    signOut(@Session() session: SecureSession) {
        session.userId = null;
    }

    @Post('signup')
    async signUp(
        @Body() body: CreateUserDto,
        @Session() session: SecureSession,
    ) {
        const user = await this.authService.signUp(body.email, body.password);

        session.userId = user.id;

        return user;
    }

    @Post('signin')
    async signIn(
        @Body() body: CreateUserDto,
        @Session() session: SecureSession,
    ) {
        const user = await this.authService.signIn(body.email, body.password);

        session.userId = user.id;

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
