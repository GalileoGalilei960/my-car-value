import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    async create(email: string, password: string) {
        const user = this.repo.create({ email, password });

        await this.repo.save(user);

        return user;
    }

    async findOne(id: number | undefined): Promise<User | null> {
        if (!id) return null;

        const user = await this.repo.findOneBy({ id });

        if (!user) return null;

        return user;
    }

    async find(email: string) {
        return this.repo.findOneBy({ email });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.repo.findOneBy({ id });

        if (!user)
            throw new NotFoundException(`User with id ${id} does not exist`);

        const updatedUser = Object.assign(user, attrs);

        return this.repo.save(updatedUser);
    }

    async delete(id: number) {
        const user = await this.findOne(id);

        if (user) await this.repo.remove(user);

        return user;
    }
}
