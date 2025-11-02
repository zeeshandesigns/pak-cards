"use client";
import { assets } from "@/assets/assets";
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import CategoriesMarquee from "./CategoriesMarquee";

const Hero = () => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₨"; // symbol for PKR - ₨

  return (
    <div className="mx-4 sm:mx-6">
      <div className="flex max-xl:flex-col gap-5 sm:gap-8 max-w-7xl mx-auto my-6 sm:my-10">
        <div className="relative flex-1 flex flex-col bg-green-200 rounded-2xl sm:rounded-3xl xl:min-h-100 group">
          <div className="p-6 sm:p-16">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-green-300 text-green-600 pr-3 sm:pr-4 p-1 rounded-full text-xs sm:text-sm">
              <span className="bg-green-600 px-2 sm:px-3 py-1 rounded-full text-white text-xs">
                NEW
              </span>{" "}
              Instant Digital Delivery!{" "}
              <ChevronRightIcon
                className="group-hover:ml-2 transition-all"
                size={16}
              />
            </div>
            <h2 className="text-2xl sm:text-5xl leading-tight sm:leading-[1.2] my-3 sm:my-3 font-medium bg-gradient-to-r from-slate-600 to-[#A0FF74] bg-clip-text text-transparent max-w-xs sm:max-w-md">
              Gift Cards you'll love. Prices you'll trust.
            </h2>
            <div className="text-slate-800 text-sm font-medium mt-3 sm:mt-8">
              <p className="text-xs sm:text-sm">Starting from</p>
              <p className="text-2xl sm:text-3xl">{currency}500</p>
            </div>
            <button className="bg-slate-800 text-white text-xs sm:text-sm py-2 px-5 sm:py-5 sm:px-12 mt-3 sm:mt-10 rounded-md hover:bg-slate-900 hover:scale-103 active:scale-95 transition">
              SHOP NOW
            </button>
          </div>
          <Image
            className="sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm px-6 sm:px-0"
            src={assets.hero_model_img}
            alt=""
          />
        </div>
        <div className="flex flex-col md:flex-row xl:flex-col gap-4 sm:gap-5 w-full xl:max-w-sm text-sm text-slate-600">
          <div className="flex-1 flex items-center justify-between w-full bg-orange-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 px-6 sm:px-8 group">
            <div>
              <p className="text-2xl sm:text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-32 sm:max-w-40">
                Top Brands
              </p>
              <p className="flex items-center gap-1 mt-3 sm:mt-4 text-xs sm:text-sm">
                Explore{" "}
                <ArrowRightIcon
                  className="group-hover:ml-2 transition-all"
                  size={16}
                />{" "}
              </p>
            </div>
            <Image
              className="w-28 sm:w-35"
              src={assets.hero_product_img1}
              alt=""
            />
          </div>
          <div className="flex-1 flex items-center justify-between w-full bg-blue-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 px-6 sm:px-8 group">
            <div>
              <p className="text-2xl sm:text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-32 sm:max-w-40">
                Best Deals
              </p>
              <p className="flex items-center gap-1 mt-3 sm:mt-4 text-xs sm:text-sm">
                Shop Now{" "}
                <ArrowRightIcon
                  className="group-hover:ml-2 transition-all"
                  size={16}
                />{" "}
              </p>
            </div>
            <Image
              className="w-28 sm:w-35"
              src={assets.hero_product_img2}
              alt=""
            />
          </div>
        </div>
      </div>
      <CategoriesMarquee />
    </div>
  );
};

export default Hero;
