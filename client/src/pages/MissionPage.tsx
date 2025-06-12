import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Target, Heart, Users, Compass, Shield } from "lucide-react";

const MissionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#088395] to-[#05BFDB] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
              Our Mission
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Empowering ocean lovers worldwide to explore, learn, and protect our marine environments
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Vision Section */}
        <Card className="mb-12 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#088395] to-[#05BFDB] rounded-full flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-montserrat font-bold text-[#0A4D68]">
              🌍 Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-center text-gray-700 leading-relaxed max-w-4xl mx-auto">
              To deepen global ocean literacy and foster a lifelong connection to the underwater world.
            </p>
          </CardContent>
        </Card>

        {/* Mission Section */}
        <Card className="mb-12 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#088395] to-[#05BFDB] rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-montserrat font-bold text-[#0A4D68]">
              🎯 Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-center text-gray-700 leading-relaxed max-w-4xl mx-auto">
              To create an interactive, accessible platform that empowers divers, snorkellers, and ocean lovers to explore marine environments, learn about ocean life, share experiences, and inspire stewardship through curiosity, education, and community.
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#088395] to-[#05BFDB] rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-montserrat font-bold text-[#0A4D68] mb-4">
              💙 Values
            </CardTitle>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We value curiosity, respect, and the pursuit of knowledge about our ocean, and we aim to promote ocean stewardship worldwide.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Curiosity */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#E0F7FA] rounded-full flex items-center justify-center flex-shrink-0">
                  <Compass className="w-6 h-6 text-[#088395]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0A4D68] mb-2">Curiosity</h3>
                  <p className="text-gray-700">
                    Encouraging lifelong learning and exploration beneath the surface.
                  </p>
                </div>
              </div>

              {/* Respect */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#E0F7FA] rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-[#088395]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0A4D68] mb-2">Respect</h3>
                  <p className="text-gray-700">
                    For marine life, ocean ecosystems, and diverse perspectives.
                  </p>
                </div>
              </div>

              {/* Connection */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#E0F7FA] rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-[#088395]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0A4D68] mb-2">Connection</h3>
                  <p className="text-gray-700">
                    Strengthening bonds between people, place, and the ocean.
                  </p>
                </div>
              </div>

              {/* Stewardship */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#E0F7FA] rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-[#088395]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#0A4D68] mb-2">Stewardship</h3>
                  <p className="text-gray-700">
                    Inspiring care and responsibility for the ocean we all share.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-[#088395] to-[#05BFDB] rounded-lg p-8 text-white">
            <h2 className="text-2xl font-montserrat font-bold mb-4">
              Join Our Ocean Community
            </h2>
            <p className="text-lg mb-6 text-blue-100">
              Together, we can explore, learn, and protect our ocean's incredible biodiversity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/community" 
                className="bg-white text-[#088395] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Join the Community
              </a>
              <a 
                href="/" 
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#088395] transition-colors"
              >
                Explore Dive Sites
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionPage;