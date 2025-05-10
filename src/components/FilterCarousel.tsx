'use client';

import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import {
  CarouselContent,
  CarouselApi,
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './ui/carousel';
import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';

interface FilterCarouselProps {
  value?: string | null;
  isLoading?: boolean;
  onSelect: (value: string | null) => void;
  data?: {
    // TODO make data requiered
    value: string;
    label: string;
  }[];
}

function FilterCarousel({ data, isLoading, onSelect, value }: FilterCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative w-full">
      {/* left fade */}
      <div
        className={cn(
          'left-fade pointer-events-none absolute top-0 bottom-0 left-12 z-10 w-12 bg-gradient-to-r from-white to-transparent',
          current === 1 && 'hidden'
        )}
      />
      <Carousel opts={{ align: 'start', dragFree: true }} setApi={setApi} className="w-full px-12">
        <CarouselContent className="-ml-3">
          {isLoading &&
            Array.from({ length: 20 }).map((_, index) => (
              <CarouselItem key={index} className="basis-auto pl-3">
                <Skeleton className="h-full w-[100px] rounded-lg px-3 py-1 text-sm font-semibold">
                  &nbsp;
                </Skeleton>
              </CarouselItem>
            ))}
          {!isLoading && (
            <CarouselItem onClick={() => onSelect(null)} className="basis-auto pl-3">
              <Badge
                className="cursor-pointer rounded-lg px-3 py-1 text-sm whitespace-nowrap"
                variant={!value ? 'default' : 'secondary'}
              >
                ALL
              </Badge>
            </CarouselItem>
          )}
          {!isLoading &&
            data?.map((item) => (
              <CarouselItem
                onClick={() => onSelect(item.value)}
                className="basis-auto pl-3"
                key={item.value}
              >
                <Badge
                  variant={value === item.value ? 'default' : 'secondary'}
                  className="cursor-pointer rounded-lg px-3 py-1 text-sm whitespace-nowrap"
                >
                  {item.label}
                </Badge>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 z-20" />
        <CarouselNext className="right-0 z-20" />
      </Carousel>
      {/* right fade */}
      <div
        className={cn(
          'right-fade pointer-events-none absolute top-0 right-12 bottom-0 z-10 w-12 bg-gradient-to-r from-transparent to-white',
          current === count && 'hidden'
        )}
      />
    </div>
  );
}
export default FilterCarousel;
