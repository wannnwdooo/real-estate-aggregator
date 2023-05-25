import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Apartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: number;

  @Column()
  rooms: number;

  @Column('decimal', { precision: 5, scale: 2 })
  area: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'price_per_meter' })
  pricePerMeter: number;

  @Column()
  floor: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'created_at' })
  createdAt: string;

  @Column({ name: 'updated_at' })
  updatedAt: string;

  @BeforeInsert()
  @BeforeUpdate()
  calculatePricePerMeter() {
    if (this.area && this.price) {
      this.pricePerMeter = this.price / this.area;
    }
  }

  @BeforeInsert()
  setTimestampsOnInsert() {
    const currentDate = new Date().toISOString();
    this.createdAt = currentDate;
    this.updatedAt = currentDate;
  }

  @BeforeUpdate()
  setTimestampsOnUpdate() {
    const currentDate = new Date().toISOString();
    if (this.createdAt) {
      this.updatedAt = currentDate;
    }
  }
}
