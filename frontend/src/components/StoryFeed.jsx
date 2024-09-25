import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'; // Import from 'swiper/react'
import 'swiper/css'; // Core Swiper styles
import 'swiper/css/navigation'; // Import navigation styles if needed
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

const StoryBar = () => {
    const {user, suggestedUsers } = useSelector(store => store.auth)
    return (
        <div className="flex w-full px-2 py-4 bg-white">            <Swiper
                spaceBetween={10}
                slidesPerView={'auto'}
                className="flex"
            >
                {suggestedUsers.map((story) => (
                    <SwiperSlide key={story._id} className="w-16">
                        <div className="flex flex-col items-center">
                            <div className=" h-16 w-16 rounded-full border-2 border-pink-500 p-0.5">
                                <img
                                    src={story.profilePicture || 'https://res.cloudinary.com/dlyqln4gb/image/upload/v1727284693/mjrkrfogona9hoy5s5m0.jpg'}
                                    alt={story.fullname}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <p className="text-xs mt-1 text-center">{story.username}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default StoryBar;
