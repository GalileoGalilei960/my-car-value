import { Exclude } from 'class-transformer';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    AfterUpdate,
    AfterRemove,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @AfterUpdate()
    LogUpdate() {
        console.log(`Elementwith id ${this.id} was updated`);
    }

    @AfterRemove()
    LogDelete() {
        console.log(`Elementwith id ${this.id} was deleted`);
    }
}
