import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from '../ui/Image.jsx'

export default function Carousel({images}){
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        children: false
    };
    return (
        <div>
            <Slider {...settings}>
                {images.map((image, index) => {
                    return <Image
                        src={image}
                        alt='photo'
                        key={index}
                        width='300px'
                        data-index={index}/>
                })}
            </Slider>
        </div>
    );
}