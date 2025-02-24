import React from 'react';
import { BookOpenCheck, Brain, FileQuestion } from 'lucide-react';
import FeatureCard from '../FeatureCard/FeatureCard.jsx'

const Features = () => {
  const features = [
    {
      title: "Mock Tests",
      description: "Practice with our comprehensive mock tests designed by experts",
      icon: <BookOpenCheck className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000",
    },
    {
      title: "AI Translation",
      description: "Seamlessly translate content with our advanced AI technology",
      icon: <Brain className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1000",
    },
    {
      title: "Question Papers",
      description: "Access previous year papers and curated practice sets",
      icon: <FileQuestion className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1000",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </main>
  );
};

export default Features;