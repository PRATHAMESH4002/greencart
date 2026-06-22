import React from "react";
import PageWrapper from "../components/PageWrapper";

import MainBanner from "../components/MainBanner";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import BottomBanner from "../components/BottomBanner";
import NewsLetter from "../components/NewsLetter";


const Home = () => {
  return (
    <PageWrapper>
      <div className="space-y-20">
        <div className="slide-in-left">
          <MainBanner />
        </div>
        <div className="slide-in-right">
          <Categories />
        </div>
        <div className="bounce-in">
          <BestSeller />
        </div>
        <div className="fade-in">
          <BottomBanner />
        </div>
        <div className="slide-in-left">
          <NewsLetter />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Home;
