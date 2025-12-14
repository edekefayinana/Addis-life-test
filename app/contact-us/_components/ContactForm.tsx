import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ContactForm() {
  return (
    <Card className="bg-[#F6F8FA] w-full p-4 lg:p-8 shadow-none rounded-xl md:rounded-3xl">
      <form className="space-y-3 md:space-y-6">
        {/* First Name and Last Name Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-3 flex flex-col">
            <Label htmlFor="firstName" className="text-base font-medium">
              First Name *
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Eg, Biruk"
              className="h-14 px-6 py-4 rounded-xl shadow-none border"
            />
          </div>
          <div className="space-y-3 flex flex-col">
            <Label htmlFor="lastName" className="text-base font-medium">
              Last Name *
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Eg, Solomon"
              className="h-14 px-6 py-4 rounded-xl shadow-none border"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-3 flex flex-col">
          <Label htmlFor="email" className="text-base font-medium">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Example1@gmail.com"
            className="h-14 px-6 py-4 rounded-xl shadow-none"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-3 flex flex-col">
          <Label htmlFor="phone" className="text-base font-medium">
            Phone Nmber *
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(+251)-911-201096"
            className="h-14 px-6 py-4 rounded-xl shadow-none"
          />
        </div>

        {/* Description */}
        <div className="space-y-3 flex flex-col">
          <Label htmlFor="description" className="text-base font-medium">
            Description *
          </Label>
          <Textarea
            id="description"
            placeholder="Write Your questions in detail..."
            className="min-h-[140px] px-7 py-4 rounded-xl shadow-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="h-12 lg:h-14 w-full rounded-full bg-primary text-base mt-4 lg:mt-8"
        >
          Send A message
        </Button>
      </form>
    </Card>
  );
}
