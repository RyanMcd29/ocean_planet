import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";

export interface Badge {
  category: string;
  badgeName: string;
  badgeIcon: string;
  unlockedAt?: Date;
  isLocked?: boolean;
  completedCount?: number;
  totalCount?: number;
}

interface BadgeShowcaseProps {
  badges: Badge[];
  className?: string;
}

export function BadgeShowcase({ badges, className = "" }: BadgeShowcaseProps) {
  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
        Achievement Badges
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <Card
            key={badge.category}
            className={`transition-all duration-300 hover:scale-105 ${
              badge.isLocked
                ? "opacity-50 bg-muted/30"
                : "bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 border-sky-200 dark:border-sky-800"
            }`}
            data-testid={`badge-${badge.category}`}
          >
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="relative">
                <div className={`text-5xl ${badge.isLocked ? "grayscale" : ""}`}>
                  {badge.badgeIcon}
                </div>
                {badge.isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {badge.badgeName}
                </p>
                {badge.isLocked && badge.completedCount !== undefined && badge.totalCount !== undefined && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {badge.completedCount}/{badge.totalCount} lessons
                  </p>
                )}
                {!badge.isLocked && badge.unlockedAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
