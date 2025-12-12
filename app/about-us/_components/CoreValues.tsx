import React from 'react';

type CoreValues = {
  id: number;
  title: string;
  description: string;
};

type Achievements = {
  id: number;
  title: string;
  value: string;
};
export default function CoreValues() {
  const coreValues: CoreValues[] = [
    {
      id: 1,
      title: 'Integrity & Transparency',
      description:
        'We act with honesty and openness in everything we do, ensuring our actions and decisions are clear, ethical, and trustworthy.',
    },
    {
      id: 2,
      title: 'Customer Commitment',
      description:
        'Our clients’ needs guide our decisions, ensuring a personalized and supportive experience.',
    },
    {
      id: 3,
      title: 'Trust & Reliability',
      description:
        'We consistently deliver on our promises, earning lasting confidence through dependable, high-quality service.',
    },
  ];

  const achievements: Achievements[] = [
    {
      id: 1,
      title: 'Satisfied Customers',
      value: '10,000+',
    },
    {
      id: 2,
      title: 'Years of Experience',
      value: '10+',
    },
    {
      id: 3,
      title: 'Deliverd Projects',
      value: '10+',
    },
    {
      id: 4,
      title: 'Employees',
      value: '10+',
    },
  ];
  return (
    <section className="bg-primary rounded-3xl py-20 flex flex-col">
      <div className="flex w-full max-w-[1212px] mx-auto gap-10 flex-col items-center justify-center">
        <div className="flex flex-col w-full max-w-[720px] justify-center items-center gap-3 text-white">
          <h2 className="text-4xl font-bold font-instrument leading-tight md:text-5xl">
            Our Core Values
          </h2>
          <p className=" text-center text-lg leading-relaxed ">
            Principles that shape our culture, guide our decisions, influence
            how we work together, and define the way we serve and support our
            clients.
          </p>
        </div>
        <div className="flex gap-6 max-w-[1212px] mx-auto">
          {coreValues.map((value) => (
            <div
              key={value.id}
              className="flex flex-col w-full p-6 gap-2 bg-white rounded-2xl"
            >
              <span className="p-3 rounded-sm shadow-sm size-12 flex items-center justify-center bg-[#F5F5F5] text-xl font-semibold">
                {value.id}
              </span>
              <p className="text-lg font-semibold">{value.title}</p>
              <p className="text-description text-base leading-[150%]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <span className="w-full w-full mx-auto h-[1px] bg-white/20 my-16" />
      <div className="flex flex-col gap-10 items-center justify-center text-white">
        <p className="text-xl font-medium">Number & Achievements</p>
        <div className="flex w-full mt-5 max-w-[1100px] mx-auto items-center justify-around gap-8 relative">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="flex flex-col items-center justify-center gap-3 relative flex-1"
            >
              <p className="text-4xl font-semibold">{achievement.value}</p>
              <p className="text-base font-normal opacity-90">
                {achievement.title}
              </p>
              {index < achievements.length - 1 && (
                <span className="h-16 w-px absolute -right-4 top-1/2 -translate-y-1/2 bg-white/30"></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
