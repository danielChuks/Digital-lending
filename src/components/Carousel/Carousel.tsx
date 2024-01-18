import React, { useState } from 'react';
import styles from './Carousel.module.css';

interface CarouselProps {
    items: any;
}

const Carousel: React.FC<CarouselProps> = (props: CarouselProps) => {
    const [slideIndex, setSlideIndex] = useState<number>(0);

    return (
        <div>
            <div className={styles['slideshow-container']}>
                <iframe
                    title="DBS Bank Offers"
                    src="http://10.152.5.97:9070/rubikonciapp/app/dbs/userservice/getBankOffers"
                    style={{ border: '0px solid #ccc' }}
                ></iframe>
            </div>
        </div>
    );
};

export default Carousel;
