"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FlowingMenu from "@/components/FlowingMenu";

const allProjects = [
  {
    link: "https://afs-gpt.vercel.app",
    text: "AFSGPT Platform",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&h=400&auto=format&fit=crop",
  },
  {
    link: "https://tripz-ai.vercel.app",
    text: "Multi Agent Trip Planner",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&h=400&auto=format&fit=crop",
  },
  {
    link: "https://github.com/hameed-afsar-km/AI-Surveillance-System",
    text: "AI Surveillance",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=600&h=400&auto=format&fit=crop",
  },
  {
    link: "https://miaksaaa.vercel.app",
    text: "Miaksaaa Ecommerce",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&h=400&auto=format&fit=crop",
  },
  {
    link: "https://git-subway.vercel.app",
    text: "GitSubway 3D World",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&h=400&auto=format&fit=crop",
  },
  {
    link: "https://github.com/hameed-afsar-km",
    text: "Blog Engine",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&h=400&auto=format&fit=crop",
  },
  {
    link: "https://github.com/hameed-afsar-km",
    text: "Real-time Chat App",
    image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=600&h=400&auto=format&fit=crop",
  },
  {
    link: "https://github.com/hameed-afsar-km",
    text: "Analytics Dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&h=400&auto=format&fit=crop",
  },
];

export default function ProjectsPage() {
  return (
    <div className="projects-page">
      <div className="projects-page-header">
        <Link href="/#projects" className="projects-back-btn">
          <ArrowLeft size={20} />
          <span>BACK</span>
        </Link>
        <div className="projects-page-tag">// ALL PROJECTS</div>
        <h1 className="projects-page-title">THE WORK</h1>
        <div className="projects-page-line" />
        <p className="projects-page-desc">
          Hover over each project to preview. Click to explore.
        </p>
      </div>

      <div className="projects-page-menu">
        <FlowingMenu
          items={allProjects}
          speed={18}
          textColor="#ece8e1"
          bgColor="#05050d"
          marqueeBgColor="#ff4655"
          marqueeTextColor="#080810"
          borderColor="rgba(255,70,85,0.12)"
        />
      </div>
    </div>
  );
}
