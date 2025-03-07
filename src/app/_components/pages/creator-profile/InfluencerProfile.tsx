import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Facebook, Instagram, Youtube, Link, X } from 'lucide-react';

export default function InfluencerProfile() {
  return (
    <Card className="bg-white rounded-[20PX] shadow-lg overflow-hidden border border-gray-200 ">
      <div className="relative w-full h-40 md:h-48 bg-blue-100 rounded-b-[20px]">
        <img
          src="/background-image.jpg"
          alt="Background"
          className="w-full h-full object-cover rounded-b-[20px]"
        />
        <div className="absolute -bottom-10 left-4 md:-bottom-12 md:left-6">
          <Avatar className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] border-4 border-white shadow-lg">
            <AvatarImage src="/profile.jpg" alt="Jhon Deo" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
        <div className="absolute right-4 md:right-6 top-44 md:top-56 flex gap-2 md:gap-4 text-gray-500 text-lg md:text-2xl">
          <Facebook className="cursor-pointer hover:text-blue-600" />
          <X className="cursor-pointer hover:text-gray-800" />
          <Instagram className="cursor-pointer hover:text-pink-500" />
          <Youtube className="cursor-pointer hover:text-red-500" />
        </div>
      </div>
      <CardContent className="pt-16 md:pt-20 pb-4 md:pb-6 px-4 md:px-6 flex flex-col gap-3 md:gap-4">
        <div className="flex flex-wrap items-center gap-1 md:gap-2">
          <h2 className="text-base md:text-lg font-medium">Jhon Deo</h2>
          <span className="text-sm md:text-base text-gray-600">(@john_doe_90)</span>
          <Link className="text-primary cursor-pointer w-4 h-4 md:w-5 md:h-5" />
        </div>
        <p className="text-xs md:text-sm text-gray-600">
          Helping men stay stylish with the latest fashion trends.
        </p>
        <div className="flex gap-2 md:gap-4 flex-wrap">
          {['#Fashion', '#MenGrooming', '#StyleTips', '#LuxuryWear'].map((tag) => (
            <span key={tag} className="bg-gray-100 text-xs md:text-sm px-3 py-1 rounded-md">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-xs md:text-sm text-gray-600">
          I'm John, a fashion influencer sharing style tips, outfit inspiration, and grooming advice for men.
        </p>
        <div className="flex gap-2 md:gap-4">
          <Button className="bg-primary hover:bg-pink-600 text-white px-4 md:px-5 py-1 md:py-2 rounded-md text-xs md:text-sm">
            Fashion & Beauty
          </Button>
          <Button className="bg-primary hover:bg-pink-600 text-white px-4 md:px-5 py-1 md:py-2 rounded-md text-xs md:text-sm">
            Men's Fashion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
