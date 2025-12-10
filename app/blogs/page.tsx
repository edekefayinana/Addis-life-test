import React from 'react';

import Home from './_components/Home';
import FeaturedLists from './_components/FeaturedLists';
import BlogsList from './_components/BlogsList';

export default function page() {
  return (
    <main>
      <Home />
      <FeaturedLists />
      <BlogsList />
    </main>
  );
}
