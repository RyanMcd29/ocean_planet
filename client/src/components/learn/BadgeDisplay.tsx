import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
}

interface BadgeDisplayProps {
  badges: Badge[];
}

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);

  return (
    <div className="space-y-8">
      {earnedBadges.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Badges</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {earnedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {unearnedBadges.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Badges to Earn</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {unearnedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {badges.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No badges available</h3>
          <p className="text-gray-500">Complete lessons and quizzes to earn badges</p>
        </div>
      )}
    </div>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-md ${badge.earned ? 'border-[#05BFDB]' : 'opacity-75'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-center items-center w-full mb-3">
          <div className={`p-3 rounded-full ${badge.earned ? 'bg-[#E0F7FA]' : 'bg-gray-100'}`}>
            {badge.icon}
          </div>
        </div>
        <CardTitle className="text-center">{badge.name}</CardTitle>
        <CardDescription className="text-center">{badge.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {badge.earned ? (
          <div className="text-center text-sm text-green-600 font-medium">
            Earned
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500">
            Not yet earned
          </div>
        )}
      </CardContent>
      {badge.earned && (
        <div className="absolute -top-4 -right-4 h-16 w-16 bg-gradient-to-br from-[#05BFDB] to-[#0A4D68] transform rotate-45" />
      )}
    </Card>
  );
}