import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'package_content' })
export class PackageModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Generated('increment')
  package_number: number;
  @Column({ type: 'integer', nullable: false })
  view_priority: number;
  @Column({ type: 'text', nullable: false, unique: true })
  location_caption: string;
  @Column({ type: 'text', nullable: false, unique: true })
  package_slug: string;
  @Column({ type: 'text', nullable: false })
  package_title: string;
  @Column({ type: 'text', nullable: false })
  package_banner_image: string;
  @Column({ type: 'text', nullable: false })
  package_details: string;
  @Column({ type: 'text', nullable: true })
  pickup_time: string;
  @Column({ type: 'integer', nullable: false })
  price: number;
  @Column({ type: 'integer', nullable: false })
  per_pax_price: number;
  @Column({ type: 'integer', nullable: false })
  min_pax: number;
  @Column({ type: 'integer', nullable: false })
  discount: number;
  @Column({ type: 'text', nullable: false })
  image1: string;
  @Column({ type: 'text', nullable: false })
  image2: string;
  @Column({ type: 'text', nullable: false })
  image3: string;
  @Column({ type: 'text', nullable: false })
  image4: string;
  @Column({ type: 'text', nullable: false })
  image5: string;
  @Column({ type: 'text', nullable: false })
  image6: string;
  @Column({ type: 'text', nullable: false })
  image7: string;
  @Column({ type: 'text', nullable: false })
  image8: string;
  @Column({ type: 'text', nullable: false })
  image9: string;
  @Column({ type: 'text', nullable: false })
  thumbnail: string;
}
