import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

// Import the banner image
import bannerImage from '../../../assets/buyer-homepage-banner.png';
import landingImage from '../../../assets/landing-v3.png'

const items = [
  {
    title: "Welcome to GudFood",
    description: "Reducing food waste, one purchase at a time.",
    image: bannerImage
  },
  {
    title: "Sustainable Shopping",
    description: "Find great deals on surplus food products.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    title: "Join Our Mission",
    description: "Help us create a more sustainable future.",
    image: "https://plus.unsplash.com/premium_photo-1663045364339-609da2a35cd1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];

const BuyerHomeCarousel = () => {
  return (
    <Carousel 
    className="w-full max-w-screen-xl mx-auto mb-8"
    opts={{
        align: "start",
        loop: true,
      }}>
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem key={index}>
            <Card className="border-none">
              {/* <CardContent className="relative flex aspect-[16/9] items-center justify-center p-0 overflow-hidden"> */}
              <CardContent className="flex items-center justify-center p-0 h-[500px] md:h-[calc(100vw*0.2604)] max-h-[500px] overflow-hidden">
                <div className="relative w-full h-full">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4">
                    <h2 className="text-4xl font-bold mb-2">{item.title}</h2>
                    <p className="text-2xl">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
};

export default BuyerHomeCarousel;