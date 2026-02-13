"use client";

import CallAction from "@/components/home/CallAction";
import CNSoftBei from "@/components/home/CNSoftBei";
import CoreFunctions from "@/components/home/CoreFunctions";
import HeroSection from "@/components/home/HeroSection";
import StatisticHighlights from "@/components/home/StatisticHighlights";
import SystemFeatures from "@/components/home/SystemFeatures";
import UserComments from "@/components/home/UserComments";
import { useEffect } from "react";
import "./app.css";

export default function HomePage() {
  useEffect(() => {
    document.querySelectorAll(".animate-on-scroll").forEach((element) => {
      element.classList.add("animated");
    });

    const handleScroll = () => {
      const elements = document.querySelectorAll(
        ".animate-on-scroll:not(.animated)",
      );
      elements.forEach((element) => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight - 150) {
          element.classList.add("animated");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing-page">
      <HeroSection />
      <StatisticHighlights />
      <CoreFunctions />
      <SystemFeatures />
      <CNSoftBei />
      <UserComments />
      <CallAction />
    </div>
  );
}
