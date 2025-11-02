"use client";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import LatestProducts from "@/components/LatestProducts";
import BestSelling from "@/components/BestSelling";
import OurSpecs from "@/components/OurSpec";
import { useSelector } from "react-redux";

export default function Home() {
  const products = useSelector((state) => state.product.list);

  return (
    <div>
      <Hero />
      <BestSelling />
      <LatestProducts />
      <OurSpecs />
      <Newsletter />
    </div>
  );
}
