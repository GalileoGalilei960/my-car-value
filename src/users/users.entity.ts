import { Exclude } from 'class-transformer';
import { Report } from 'src/reports/reports.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    AfterUpdate,
    AfterRemove,
    OneToMany,
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

    @Column({ default: false })
    isAdmin: boolean;

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

    @AfterUpdate()
    LogUpdate() {
        console.log(`Element with id ${this.id} was updated`);
    }

    @AfterRemove()
    LogDelete() {
        console.log(`Element with id ${this.id} was deleted`);
    }
}
