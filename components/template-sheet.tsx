// components/TemplateSheet.tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

export function TemplateSheet({
  onTemplateUpdate,
}: {
  onTemplateUpdate: () => void;
}) {
  const [abstinenceItems, setAbstinenceItems] = useState<string[]>([]);
  const [dailyTasks, setDailyTasks] = useState<string[]>([]);
  const [newAbstinenceItem, setNewAbstinenceItem] = useState("");
  const [newDailyTask, setNewDailyTask] = useState("");

  useEffect(() => {
    fetchTemplate();
  }, []);

  const fetchTemplate = async () => {
    try {
      const response = await axios.get("/api/templates");
      setAbstinenceItems(response.data.abstinenceItems);
      setDailyTasks(response.data.dailyTasks);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load template");
    }
  };

  const saveTemplate = async () => {
    try {
      await axios.post("/api/templates", {
        abstinenceItems,
        dailyTasks,
      });
      toast.success("Template saved successfully");
      onTemplateUpdate();
    } catch (error) {
      console.error(error)
      toast.error("Failed to save template");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Edit Template
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Edit Daily Template</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
          <div className="grid gap-4 py-4">
            <div>
              <h3 className="font-semibold mb-2">Abstinence Items</h3>
              <div className="space-y-2">
                {abstinenceItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newItems = [...abstinenceItems];
                        newItems[index] = e.target.value;
                        setAbstinenceItems(newItems);
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setAbstinenceItems((items) =>
                          items.filter((_, i) => i !== index)
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="New abstinence item"
                  value={newAbstinenceItem}
                  onChange={(e) => setNewAbstinenceItem(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && newAbstinenceItem) {
                      setAbstinenceItems([
                        ...abstinenceItems,
                        newAbstinenceItem,
                      ]);
                      setNewAbstinenceItem("");
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (newAbstinenceItem) {
                      setAbstinenceItems([
                        ...abstinenceItems,
                        newAbstinenceItem,
                      ]);
                      setNewAbstinenceItem("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-2">Daily Tasks</h3>
              <div className="space-y-2">
                {dailyTasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={task}
                      onChange={(e) => {
                        const newTasks = [...dailyTasks];
                        newTasks[index] = e.target.value;
                        setDailyTasks(newTasks);
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setDailyTasks((tasks) =>
                          tasks.filter((_, i) => i !== index)
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="New daily task"
                  value={newDailyTask}
                  onChange={(e) => setNewDailyTask(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && newDailyTask) {
                      setDailyTasks([...dailyTasks, newDailyTask]);
                      setNewDailyTask("");
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (newDailyTask) {
                      setDailyTasks([...dailyTasks, newDailyTask]);
                      setNewDailyTask("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            <Button onClick={saveTemplate} className="mt-8">
              Save Template
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
