import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const insights = [
  {
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop',
    title: 'Finding Your Perfect Home In Addis Ababa',
    date: 'Dec 12, 2024',
    excerpt:
      'Detailed guide on what to look for when buying property in the bustling capital.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1000&auto=format&fit=crop',
    title: 'Real Estate Trends for 2025',
    date: 'Nov 28, 2024',
    excerpt:
      'Market analysis and predictions for the upcoming year in the Ethiopian market.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1000&auto=format&fit=crop',
    title: 'Top Tips for First-Time Buyers',
    date: 'Nov 15, 2024',
    excerpt:
      'Everything you need to know before making your first real estate investment.',
  },
];

export function Insights() {
  return (
    <section className="container mx-auto py-20 px-4 md:px-6">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Our Latest Insights</h2>
        <p className="mt-4 text-muted-foreground">
          Stay updated with the latest news and trends from the real estate
          world.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((item, idx) => (
          <Card
            key={idx}
            className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative h-48 w-full">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader className="p-6 pb-2">
              <p className="text-sm text-primary font-medium">{item.date}</p>
              <h3 className="line-clamp-2 text-xl font-bold">{item.title}</h3>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <p className="line-clamp-3 text-muted-foreground text-sm mb-4">
                {item.excerpt}
              </p>
              <Button
                variant="ghost"
                className="p-0 h-auto gap-1 font-semibold hover:bg-transparent hover:underline"
              >
                Read More <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button variant="outline">View All Articles</Button>
      </div>
    </section>
  );
}
