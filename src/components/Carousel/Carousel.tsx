import React, { useState } from "react";
import styles from "./Carousel.module.css";
import CarosalImage from "../../assets/icons/dashboard/carosal.png";

interface CarouselProps {
  items: any;
}

const Carousel: React.FC<CarouselProps> = (props: CarouselProps) => {
  const [slideIndex, setSlideIndex] = useState<number>(0);

  // function plusSlides(n: number): void {
  //   showSlides(slideIndex + n);
  // }

  // function currentSlide(n: number): void {
  //   showSlides(n);
  // }

  // function showSlides(n: number): void {
  //   const slides = document.getElementsByClassName(
  //     "mySlides"
  //   ) as HTMLCollectionOf<HTMLElement>;
  //   const dots = document.getElementsByClassName(
  //     "dot"
  //   ) as HTMLCollectionOf<HTMLElement>;

  //   if (n > slides.length) {
  //     setSlideIndex(1);
  //   }

  //   if (n < 1) {
  //     setSlideIndex(slides.length);
  //   }

  //   for (let i = 0; i < slides.length; i++) {
  //     slides[i].style.display = "none";
  //   }

  //   for (let i = 0; i < dots.length; i++) {
  //     dots[i].className = dots[i].className.replace(" active", "");
  //   }

  //   slides[slideIndex - 1].style.display = "block";
  //   dots[slideIndex - 1].className += " active";
  // }

  return (
    <div>
      <div className={styles["slideshow-container"]}>
        {/* <object
          data="http://129.151.174.6:9070/rubikonciapp/app/dbs/userservice/getBankOffers"
          width="400"
          height="300"
          type="text/html"
        > */}
          {/* <embed
            src="http://129.151.174.6:9070/rubikonciapp/app/dbs/userservice/getBankOffers"
            width="600"
            height="400"
          >
          </embed> */}
        {/* </object> */}
        <iframe
          src="http://10.152.5.97:9070/rubikonciapp/app/dbs/userservice/getBankOffers"
          frameBorder="0"
        ></iframe>
        {/* <div className={`${styles.mySlides} ${styles.fade}`}>
          {props.items.map((item: any, index: number) => (
            <div key={index} className={index === slideIndex ? 'slide active' : 'slide'}>
              <img className={styles["carousel-image"]} src={item.itemImage} alt="" />
            </div>
          ))}
        </div> */}
      </div>
      {/* <div className={styles["dots-container"]}>
        <span className={styles["dot"]} onClick={() => currentSlide(1)}></span>
        <span className={styles["dot"]} onClick={() => currentSlide(2)}></span>
        <span className={styles["dot"]} onClick={() => currentSlide(3)}></span>
      </div> */}
    </div>
  );
};

export default Carousel;
