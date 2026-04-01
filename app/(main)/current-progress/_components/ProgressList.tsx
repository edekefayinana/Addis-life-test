'use client';

import { useState, useEffect } from 'react';
import ProgressCard from './ProgressCard';

interface Project {
  id: string;
  name: string;
}

interface ProgressMedia {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  thumbnailUrl: string | null;
  caption: string | null;
  order: number;
}

interface SiteProgress {
  id: string;
  title: string;
  description: string | null;
  status: string;
  publishedAt: Date | null;
  project: Project;
  media: ProgressMedia[];
  createdAt: Date;
}

export default function ProgressList() {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [progress, setProgress] = useState<SiteProgress[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [progressRes, projectsRes] = await Promise.all([
          fetch('/api/site-progress'),
          fetch('/api/projects'),
        ]);

        if (progressRes.ok && projectsRes.ok) {
          const progressData = await progressRes.json();
          const projectsData = await projectsRes.json();

          // Handle wrapped response from sendResponse helper
          setProgress(progressData);
          setProjects(projectsData.data || projectsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredProgress =
    selectedProject === 'all'
      ? progress
      : progress.filter((p) => p.project.id === selectedProject);

  if (loading) {
    return (
      <div>
        {/* Filter Skeleton */}
        <div className="mb-8">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Progress Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Image Skeleton */}
              <div className="h-48 bg-gray-200 animate-pulse"></div>

              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filter */}
      <div className="mb-8">
        <label
          htmlFor="project-filter"
          className="block text-sm font-medium mb-2"
        >
          Filter by Project
        </label>
        <select
          id="project-filter"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Progress Grid */}
      {filteredProgress.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No progress updates available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProgress.map((item) => (
            <ProgressCard key={item.id} progress={item} />
          ))}
        </div>
      )}
    </div>
  );
}
