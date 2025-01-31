import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function Journal({ dailyData, handleJournalChange }: any) {
  return (
    <Card className="relative overflow-hidden border bg-card text-card-foreground shadow-lg lg:col-span-3">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-[2px]" />

      <CardHeader className="relative space-y-1.5">
        <CardTitle className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Daily Journal
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Record your thoughts and reflections
        </p>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="rounded-lg bg-primary/5 p-4 ring-1 ring-primary/10">
          <p className="font-medium text-primary">
            Today&apos;s Prompt: {dailyData?.journalPrompt}
          </p>
        </div>

        <Textarea
          placeholder="Write your thoughts here..."
          className="min-h-[200px] resize-none border-input/20 bg-background/50 
            transition-colors placeholder:text-muted-foreground/60
            focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
          value={dailyData?.journalEntry}
          onChange={handleJournalChange}
        />
      </CardContent>
    </Card>
  );
}
