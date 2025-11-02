import React from "react";
import Title from "./Title";

const Newsletter = () => {
  return (
    <div className="flex flex-col items-center mx-4 my-20 sm:my-36">
      <Title
        title="Stay Updated"
        description="Get notified about new gift cards, exclusive deals, and special offers delivered to your inbox."
        visibleButton={false}
      />
      <div className="flex flex-col sm:flex-row bg-slate-100 text-xs sm:text-sm p-1 rounded-full w-full max-w-xl my-6 sm:my-10 border-2 border-white ring ring-slate-200 gap-2 sm:gap-0">
        <input
          className="flex-1 pl-4 sm:pl-5 py-3 sm:py-0 outline-none bg-transparent"
          type="email"
          placeholder="Enter your email"
        />
        <button className="font-medium bg-green-500 text-white px-6 sm:px-7 py-3 rounded-full hover:scale-103 active:scale-95 transition">
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default Newsletter;
