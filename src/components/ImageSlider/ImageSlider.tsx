import {
    BaseSyntheticEvent,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import {
    CatImage,
    useGetCatsQuery,
    useLazyGetOneCatQuery,
} from '../../api/catApi';
import { Modal } from '../ImageModal/ImageModal';
import { Loader } from '../Loader/Loader';
import './ImageSlider.scss';

interface ImageSliderProps {
    previewCount?: number;
}

export const ImageSlider = memo(({ previewCount = 3 }: ImageSliderProps) => {
    const [cats, setCats] = useState<CatImage[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
    const [selectedCat, setSelectedCat] = useState<string | null>(null);

    const prevRef = useRef<HTMLDivElement>(null);
    const nextRef = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<SwiperClass | null>(null);
    const [isProgress, setIsProgress] = useState(false);

    const { data: initialCats, isLoading: isInitLoading } = useGetCatsQuery(14);
    const [trigger, { data: newCat, isFetching }] = useLazyGetOneCatQuery();

    useEffect(() => {
        if (initialCats) {
            setCats(initialCats);
        }
    }, [initialCats]);

    const handleLoadMore = useCallback(() => {
        if (swiperRef.current?.isEnd) {
            trigger();
        }
    }, [trigger]);

    useEffect(() => {
        if (newCat && newCat.length > 0) {
            setCats((prevCats) => [...prevCats, ...newCat]);
        }
    }, [newCat]);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSlideClick = useCallback(
        (e: BaseSyntheticEvent) => {
            setIsProgress(false);
            if (!isProgress) {
                const imageUrl = e.target.src;
                setSelectedCat(imageUrl);
                setModalOpen(true);
            }
        },
        [isProgress]
    );

    if (isInitLoading) {
        return <Loader />;
    }

    return (
        <>
            <Swiper
                spaceBetween={5}
                thumbs={{ swiper: thumbsSwiper }}
                onProgress={() => setIsProgress(true)}
                onSlideNextTransitionEnd={() => setIsProgress(false)}
                onSlidePrevTransitionEnd={() => setIsProgress(false)}
                onSliderFirstMove={(e) => {
                    e.on('toEdge', (e) => {
                        console.log(e);

                        handleLoadMore();
                    });
                }}
                onSwiper={(swiper: SwiperClass) => {
                    swiperRef.current = swiper;
                    swiper.navigation.init();
                    swiper.navigation.update();
                }}
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                modules={[Navigation, Thumbs]}
                className="main-swiper"
                lazyPreloadPrevNext={3}
                slidesPerView={3}
                grabCursor={true}
                centeredSlides={true}
                slideToClickedSlide={true}
                breakpoints={{
                    300: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    },
                    600: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    },
                    1000: {
                        slidesPerView: 3,
                        spaceBetween: 0,
                    },
                    1920: {
                        slidesPerView: 3,
                        spaceBetween: 5,
                    },
                }}
            >
                <div>
                    {cats?.map((slide, index) => (
                        <SwiperSlide key={slide.id} onClick={handleSlideClick}>
                            <img
                                loading="lazy"
                                src={slide.url}
                                alt={`Slide ${index}`}
                            />
                        </SwiperSlide>
                    ))}
                </div>
            </Swiper>

            {selectedCat && (
                <Modal
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    backgroundImageUrl={selectedCat}
                    closeOnClick={true}
                >
                    <img src={selectedCat} alt="Selected Cat" />
                </Modal>
            )}
            <div className="thumb-swiper-container">
                <div ref={prevRef} className="custom-prev">
                    {!swiperRef.current?.isBeginning && (
                        <span className="material-symbols-rounded">
                            skip_previous
                        </span>
                    )}
                </div>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={previewCount}
                    grabCursor={true}
                    className="thumb-swiper"
                    breakpoints={{
                        300: {
                            slidesPerView: 4,
                            spaceBetween: 0,
                        },
                        1000: {
                            slidesPerView: previewCount,
                            spaceBetween: 10,
                        },
                    }}
                >
                    {cats?.map((slide, index) => (
                        <SwiperSlide key={slide.id}>
                            <img
                                loading="lazy"
                                src={slide.url}
                                alt={`Thumb-${index}`}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div
                    ref={nextRef}
                    className="custom-next"
                    onClick={handleLoadMore}
                >
                    {isFetching ? (
                        <Loader />
                    ) : (
                        <span className="material-symbols-rounded">
                            skip_next
                        </span>
                    )}
                </div>
            </div>
        </>
    );
});

export default ImageSlider;
