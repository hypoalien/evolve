import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DailyTasks({
  dailyData,
  toggleDailyTask,
  deleteDailyTask,
  newDailyTask,
  setNewDailyTask,
  addDailyTask,
}: any) {
  return (
    <Card className="relative overflow-hidden border bg-card text-card-foreground shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-[2px]" />

      <CardHeader className="relative space-y-1.5">
        <CardTitle className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Daily Tasks
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your daily progress
        </p>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="space-y-2">
          {dailyData?.dailyTasks?.map((task: any) => (
            <div
              key={task.id}
              className="group flex items-center justify-between rounded-lg border border-border/20 bg-background/50 p-3 
                transition-all hover:bg-accent/30 hover:shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleDailyTask(task.id)}
                  className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <span
                  className={`${
                    task.completed
                      ? "text-muted-foreground line-through decoration-primary/30"
                      : "text-foreground"
                  } transition-colors`}
                >
                  {task.text}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteDailyTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 
                  hover:text-destructive focus-visible:opacity-100"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add new task..."
            value={newDailyTask}
            onChange={(e) => setNewDailyTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addDailyTask()}
            className="border-input/20 bg-background/50 transition-colors 
              focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
          />
          <Button
            onClick={addDailyTask}
            className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground 
              shadow-sm hover:from-primary/90 hover:to-primary transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
