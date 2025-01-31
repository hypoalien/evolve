import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

export default function Manifestation({
  dailyData,
  handleManifestationChange,
}: any) {
  return (
    <Card className="relative overflow-hidden border bg-card text-card-foreground shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-[2px]" />
      <CardHeader className="relative space-y-1.5">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Daily Manifestations
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Write 5 positive affirmations to manifest your desired reality
        </p>
      </CardHeader>
      <CardContent className="relative space-y-6">
        {dailyData?.manifestations.map((manifestation: any, index: any) => (
          <div key={index} className="space-y-2">
            <Input
              placeholder={`Manifestation ${index + 1}: I am...`}
              value={manifestation}
              onChange={(e) => handleManifestationChange(index, e.target.value)}
              className="border-input/20 bg-background/50 transition-colors focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
