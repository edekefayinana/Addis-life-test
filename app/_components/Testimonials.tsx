import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function Testimonials() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold">
          What Our Clients Say
        </h2>

        <Card className="mx-auto max-w-4xl overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="relative h-64 w-full md:h-auto md:w-1/3">
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop"
                  alt="Client"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="rounded-full bg-white/30 p-3 backdrop-blur-sm">
                    {/* Play button generic logic could go here */}
                    <div className="h-0 w-0 border-y-[8px] border-l-[12px] border-y-transparent border-l-white ml-1"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-center p-8 md:p-12">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <p className="text-lg italic text-muted-foreground">
                  &ldquo;Addis Life made finding my dream home incredibly easy.
                  The clear listings and professional team guided me every step
                  of the way. Highly recommended!&rdquo;
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Yohannes Tadesse
                    </h4>
                    <p className="text-sm text-muted-foreground">Homeowner</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
