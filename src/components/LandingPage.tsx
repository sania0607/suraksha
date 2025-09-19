import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Users, BookOpen, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  const { setShowLogin } = useApp();

  const features = [
    {
      icon: Shield,
      title: "Emergency Preparedness",
      description: "Comprehensive disaster response training modules"
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Separate interfaces for students and administrators"
    },
    {
      icon: BookOpen,
      title: "Interactive Learning",
      description: "Engaging quizzes and drill simulations"
    },
    {
      icon: AlertTriangle,
      title: "SOS Emergency System",
      description: "Quick emergency alert system for immediate response"
    }
  ];

  const benefits = [
    "Real-time drill simulations",
    "Performance analytics",
    "Emergency response protocols",
    "Multi-disaster preparedness"
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🛡️</div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            SafeSchool Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Digital Disaster Preparedness for Educational Institutions. 
            Comprehensive training, real-time simulations, and emergency response systems 
            to keep your school community safe and prepared.
          </p>
          <Button 
            onClick={() => setShowLogin(true)}
            className="text-lg px-8 py-6 h-auto"
            variant="module"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose SafeSchool?</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-left">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-md mx-auto shadow-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of schools already using SafeSchool Platform
              </p>
              <Button 
                onClick={() => setShowLogin(true)}
                className="w-full"
                variant="module"
              >
                Access Platform
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;