import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2, MapPin, Settings, Shield } from 'lucide-react';

const LandingPage = () => {
  // Navigate to login page
  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  // Smooth scroll function for navigation
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const pillars = [
    {
      icon: Gamepad2,
      title: "Gamified Learning",
      description: "Create simulations using real-time scenario and gamification using points and gamify response skills",
      bgColor: "bg-teal-500",
      iconBg: "bg-teal-600"
    },
    {
      icon: MapPin,
      title: "Safety Map",
      description: "Capture all hazard locations and emergency infrastructure and provide real-time location details",
      bgColor: "bg-blue-500",
      iconBg: "bg-blue-600"
    },
    {
      icon: Settings,
      title: "Centralized Admin Dashboard",
      description: "Track all user compliance, progress analytics and provide real-time emergency updates",
      bgColor: "bg-orange-400",
      iconBg: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-teal-600" />
              <div className="text-teal-600 font-bold text-xl">Suraksha</div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                About
              </button>
            </nav>

            <Button 
              onClick={navigateToLogin}
              className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Ensure Campus Safety,
                <br />
                Transform Disaster
                <br />
                Preparedness
                <br />
                <span className="text-orange-300">with Suraksha</span>
              </h1>
              <p className="text-xl mb-8 text-teal-100">
                The comprehensive web app for indian colleges and colleges, empowering suffering and staff with
                real-time alerts and gamified response skills
              </p>
              <Button 
                onClick={navigateToLogin}
                className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium rounded-lg"
              >
                See Features
              </Button>
            </div>
            
            <div className="relative">
              {/* Beautiful Students Illustration */}
              <div className="relative mb-8">
                <img 
                  src="/students-illustration.png" 
                  alt="Diverse group of college students with books and backpacks standing in front of campus buildings" 
                  className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl"
                />
                {/* Overlay with subtle gradient for better text readability if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-teal-600/10 to-transparent rounded-2xl"></div>
              </div>
              
              {/* Mobile Phone Mockup */}
              <div className="bg-white rounded-3xl p-4 shadow-2xl max-w-xs mx-auto relative -mt-20 z-10">
                <div className="bg-gray-50 rounded-2xl p-4 h-64">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-bold text-teal-600">Suraksha</div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-teal-500 text-white p-3 rounded-xl mb-4 relative">
                    <MapPin className="h-5 w-5 mb-1" />
                    <div className="text-xs font-medium">Navigate to Safety</div>
                    <div className="text-xs opacity-90">Emergency Exit Route</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <div className="h-3 bg-orange-200 rounded flex-1"></div>
                      <div className="h-3 bg-orange-400 rounded w-8"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Suraksha's 3 Pillars</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className={`w-20 h-20 ${pillar.bgColor} rounded-2xl mx-auto mb-6 flex items-center justify-center`}>
                    <pillar.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{pillar.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Suraksha</h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Suraksha was born from a simple yet powerful belief: every student and staff member deserves to feel safe and prepared for emergencies on campus.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Founded by a team of safety experts, educators, and technology professionals, we recognized that traditional disaster preparedness training was falling short. Students were disengaged, compliance was low, and when emergencies occurred, response was often chaotic.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our solution combines cutting-edge technology with proven educational methodologies to create an engaging, comprehensive, and effective disaster preparedness platform specifically designed for the unique challenges of educational institutions.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  To revolutionize disaster preparedness in educational institutions by making safety training engaging, accessible, and effective for every member of the campus community.
                </p>
              </div>

              <div className="mt-8">
                <Button 
                  onClick={navigateToLogin}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg font-medium rounded-lg"
                >
                  Join Our Mission
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="p-6 shadow-lg bg-white">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                      <Shield className="h-6 w-6 text-teal-600" />
                    </div>
                    <h4 className="font-bold text-gray-900">Safety First</h4>
                  </div>
                  <p className="text-gray-600">
                    Every feature is designed with safety as the top priority, ensuring comprehensive emergency preparedness.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 shadow-lg bg-white">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                      <Gamepad2 className="h-6 w-6 text-orange-400" />
                    </div>
                    <h4 className="font-bold text-gray-900">Engaging Learning</h4>
                  </div>
                  <p className="text-gray-600">
                    Gamification and interactive scenarios make safety training enjoyable and memorable.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 shadow-lg bg-white">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <MapPin className="h-6 w-6 text-blue-500" />
                    </div>
                    <h4 className="font-bold text-gray-900">Real-time Solutions</h4>
                  </div>
                  <p className="text-gray-600">
                    Live mapping, instant alerts, and immediate response capabilities when it matters most.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Endorsed By Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-lg font-medium text-gray-500 mb-8">Endorsed By:</h3>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="text-gray-400 font-medium">Educational Institution Partners</div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Campus Safety?</h2>
          <p className="text-xl mb-8 text-teal-100">
            Join leading educational institutions in implementing comprehensive disaster preparedness
          </p>
          <Button 
            onClick={navigateToLogin}
            className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-4 text-lg font-medium rounded-lg"
          >
            Start Your Journey!
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;