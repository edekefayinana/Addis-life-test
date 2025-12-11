import React from 'react';

import Home from './_components/Home';
import ReadingBlog from './_components/ReadingBlog';
import LatestListings from './_components/LatestListings';

export default function page() {
  return (
    <main>
      <Home />
      <ReadingBlog />
      <LatestListings />
    </main>
  );
}
