"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import FlowingMenu from "@/components/FlowingMenu";
import ParticleBackgroundMono from "@/components/ParticleBackgroundMono";

const allProjects = [
  {
    link: "https://afs-gpt.vercel.app",
    text: "AFSGPT Platform",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&h=400&auto=format&fit=crop",
    category: "AI",
  },
  {
    link: "https://f1-demo-jet.vercel.app",
    text: "Ferrari F1 Experience",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&h=400&auto=format&fit=crop",
    category: "Interactive",
  },
  {
    link: "https://cres-techno-club.vercel.app",
    text: "Crescent Technocrats Club",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&h=400&auto=format&fit=crop",
    category: "Web Dev",
  },
  {
    link: "https://miaksaaa.vercel.app",
    text: "Miaksaaa Ecommerce",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&h=400&auto=format&fit=crop",
    category: "Full Stack",
  },
  {
    link: "https://git-subway.vercel.app",
    text: "GitSubway 3D World",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&h=400&auto=format&fit=crop",
    category: "Interactive",
  },
  {
    link: "https://definitely-safe-tm.vercel.app",
    text: "DefinitelySafe™ Architecture",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&h=400&auto=format&fit=crop",
    category: "Web Dev",
  },
  {
    link: "https://crave-snowy.vercel.app",
    text: "Crave Food Platform",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&h=400&auto=format&fit=crop",
    category: "Full Stack",
  },
  {
    link: "https://city-stat.vercel.app",
    text: "CityStat 3D Spatial",
    image: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=600&h=400&auto=format&fit=crop",
    category: "Interactive",
  },
  {
    link: "https://deadline-os.vercel.app",
    text: "DeadlineOS Smart Manager",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=600&h=400&auto=format&fit=crop",
    category: "Web Dev",
  },
  {
    link: "https://resume-builder-tau-pink-96.vercel.app",
    text: "Resume Builder Studio",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&h=400&auto=format&fit=crop",
    category: "Full Stack",
  },
  {
    link: "https://nanoitechnology.com",
    text: "NanoITechnology Brand",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&h=400&auto=format&fit=crop",
    category: "Web Dev",
  },
  {
    link: "https://tripz-ai.vercel.app",
    text: "Multi Agent Trip Planner",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&h=400&auto=format&fit=crop",
    category: "AI",
  },
  {
    link: "https://github.com/hameed-afsar-km/AI-Surveillance-System",
    text: "AI Surveillance Vision",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=600&h=400&auto=format&fit=crop",
    category: "AI",
  },
];

const categories = ["AI", "Full Stack", "Web Dev", "Interactive"];

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const filtered = allProjects.filter((p) => {
    const matchesQuery = query.trim()
      ? p.text.toLowerCase().includes(query.toLowerCase())
      : true;
    const matchesCat = activeCat ? p.category === activeCat : true;
    return matchesQuery && matchesCat;
  });

  const leftCats = categories.slice(0, 2);
  const rightCats = categories.slice(2);

  return (
    <div className="projects-page">
      {/* Particle background matching footer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <ParticleBackgroundMono />
      </div>

      <div className="projects-page-header">
        <Link href="/#projects" className="projects-back-btn">
          <ArrowLeft size={20} />
          <span>BACK</span>
        </Link>
        <div className="projects-page-tag">// ALL PROJECTS</div>
        <h1 className="projects-page-title">THE WORK</h1>
        <div className="projects-page-line" />
        <div className="projects-filter-row">
          <div className="projects-filter-group">
            {leftCats.map((cat) => (
              <button
                key={cat}
                className={`projects-cat-btn ${activeCat === cat ? "projects-cat-btn--active" : ""}`}
                onClick={() => setActiveCat(activeCat === cat ? null : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="projects-search-wrap">
            <Search size={14} className="projects-search-icon" />
            <input
              className="projects-search-input"
              type="text"
              placeholder="Search projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="projects-filter-group">
            {rightCats.map((cat) => (
              <button
                key={cat}
                className={`projects-cat-btn ${activeCat === cat ? "projects-cat-btn--active" : ""}`}
                onClick={() => setActiveCat(activeCat === cat ? null : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="projects-page-menu">
        <FlowingMenu
          items={filtered}
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
