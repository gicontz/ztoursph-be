import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'tour_content' })
export class TourModel {
    @PrimaryGeneratedColumn('increment')
    id: number;
    @Column({ type: 'text', nullable: false, unique: true })
    tour_slug: string;
    @Column({ type: 'text', nullable: false })
    tour_title: string;
    @Column({ type: 'text', nullable: false })
    tour_banner_image: string;
    @Column({ type: 'text', nullable: false })
    package_details: string;
    @Column({ type: 'integer', nullable: false })
    price: number;
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