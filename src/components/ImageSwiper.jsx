import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import PropTypes from "prop-types";

// 引入 Swiper 樣式
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ImageSwiper = ({ images }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      style={{ width: "100%", height: "400px" }}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <img
            src={image.url}
            alt={image.alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

ImageSwiper.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ImageSwiper;
