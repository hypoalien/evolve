"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Trash, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { TemplateSheet } from "@/components/template-sheet";
import { format } from "date-fns";
import { journalPrompts } from "@/questions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import axios from "axios";
declare global {
  interface Date {
    getDayOfYear(): number;
  }
}
// Add this helper function at the top of the file
Date.prototype.getDayOfYear = function () {
  const start = new Date(this.getFullYear(), 0, 0);
  const diff =
    this.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - this.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};
interface Item {
  id: number;
  text: string;
  completed: boolean;
}

interface DailyData {
  date: string;
  abstinenceItems: Item[];
  dailyTasks: Item[];
  manifestations: string[];
  journalEntry: string;
  journalPrompt: string; // Add this line
}

export default function DashboardPage() {
  const session = useSession();
  const user = session.data?.user;
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  //   const [dailyData, setDailyData] = useState<DailyData>({
  //     date: format(new Date(), "yyyy-MM-dd"),
  //     abstinenceItems: [
  //       { id: 1, text: "No Alcohol", completed: false },
  //       { id: 2, text: "No Weed", completed: false },
  //       { id: 3, text: "No Fap", completed: false },
  //       { id: 4, text: "No Women", completed: false },
  //     ],
  //     dailyTasks: [
  //       { id: 1, text: "Leetcode", completed: false },
  //       { id: 2, text: "Gym", completed: false },
  //       { id: 3, text: "Right Food", completed: false },
  //     ],
  //     manifestations: Array(5).fill(""),
  //     journalEntry: "",
  //   });
  const [dailyData, setDailyData] = useState<DailyData>({
    date: format(new Date(), "yyyy-MM-dd"),
    abstinenceItems: [],
    dailyTasks: [],
    manifestations: Array(5).fill(""),
    journalEntry: "",
    journalPrompt: journalPrompts[new Date().getDayOfYear() - 1], // Add this line
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newAbstinenceItem, setNewAbstinenceItem] = useState<string>("");
  const [newDailyTask, setNewDailyTask] = useState<string>("");

  //   const fetchDailyData = async (date: Date) => {
  //     try {
  //       setIsFetching(true);
  //       const formattedDate = format(date, "yyyy-MM-dd");
  //       const response = await axios.get(`/api/daily-data/${formattedDate}`);
  //       setDailyData(response.data);
  //     } catch (error) {
  //       toast.error("Failed to fetch data", {
  //         position: "top-center",
  //       });
  //     } finally {
  //       setIsFetching(false);
  //     }
  //   };
  const fetchDailyData = async (date: Date) => {
    try {
      setIsFetching(true);
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await axios.get(`/api/daily-data/${formattedDate}`);
      const dayOfYear = date.getDayOfYear() - 1;

      // If there's existing data, use it, otherwise use the prompt for that day
      setDailyData({
        ...response.data,
        journalPrompt: response.data.journalPrompt || journalPrompts[dayOfYear],
      });
    } catch (error) {
      console.error(error);
      // If no data exists for this date, create new data with the day's prompt
      const dayOfYear = date.getDayOfYear() - 1;
      setDailyData({
        date: format(date, "yyyy-MM-dd"),
        abstinenceItems: [],
        dailyTasks: [],
        manifestations: Array(5).fill(""),
        journalEntry: "",
        journalPrompt: journalPrompts[dayOfYear],
      });
      toast.error("Failed to fetch data", {
        position: "top-center",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const saveAllData = async () => {
    try {
      setIsSaving(true);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      await axios.post("/api/daily-data", {
        ...dailyData,
        date: formattedDate,
      });
      toast.success("All data saved successfully!", {
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save data", {
        position: "top-center",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        saveAllData();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [dailyData]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      fetchDailyData(date);
    }
  };

  useEffect(() => {
    fetchDailyData(new Date());
  }, []);

  const deleteAbstinenceItem = (id: number) => {
    setDailyData((prev) => ({
      ...prev,
      abstinenceItems: prev.abstinenceItems.filter((item) => item.id !== id),
    }));
  };

  const deleteDailyTask = (id: number) => {
    setDailyData((prev) => ({
      ...prev,
      dailyTasks: prev.dailyTasks.filter((task) => task.id !== id),
    }));
  };

  const addAbstinenceItem = () => {
    if (newAbstinenceItem.trim()) {
      setDailyData((prev) => ({
        ...prev,
        abstinenceItems: [
          ...prev.abstinenceItems,
          {
            id: Date.now(),
            text: newAbstinenceItem.trim(),
            completed: false,
          },
        ],
      }));
      setNewAbstinenceItem("");
    }
  };

  const addDailyTask = () => {
    if (newDailyTask.trim()) {
      setDailyData((prev) => ({
        ...prev,
        dailyTasks: [
          ...prev.dailyTasks,
          {
            id: Date.now(),
            text: newDailyTask.trim(),
            completed: false,
          },
        ],
      }));
      setNewDailyTask("");
    }
  };

  const handleManifestationChange = (index: number, value: string) => {
    setDailyData((prev) => {
      const newManifestations = [...prev.manifestations];
      newManifestations[index] = value;
      return {
        ...prev,
        manifestations: newManifestations,
      };
    });
  };

  const saveManifestations = () => {
    if (dailyData.manifestations.every((m) => m.trim())) {
      toast.success("Daily manifestations saved!", {
        position: "top-center",
      });
    } else {
      toast.error("Please fill all manifestation fields", {
        position: "top-center",
      });
    }
  };

  const toggleAbstinenceItem = (id: number) => {
    setDailyData((prev) => ({
      ...prev,
      abstinenceItems: prev.abstinenceItems.map((item) => {
        if (item.id === id) {
          const newStatus = !item.completed;
          if (newStatus) {
            toast.success(`Maintained: ${item.text}`, {
              position: "top-center",
            });
          }
          return { ...item, completed: newStatus };
        }
        return item;
      }),
    }));
  };

  const toggleDailyTask = (id: number) => {
    setDailyData((prev) => ({
      ...prev,
      dailyTasks: prev.dailyTasks.map((task) => {
        if (task.id === id) {
          const newStatus = !task.completed;
          if (newStatus) {
            toast.success(`Completed: ${task.text}`, {
              position: "top-center",
            });
          }
          return { ...task, completed: newStatus };
        }
        return task;
      }),
    }));
  };

  const DatePickerComponent = () => (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[240px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(selectedDate, "PPP")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  const SubmitAllButton = () => (
    <Button
      onClick={saveAllData}
      disabled={isSaving}
      className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
    >
      {isSaving ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Saving...
        </>
      ) : (
        <>Save All Progress (Ctrl+S)</>
      )}
    </Button>
  );

  const handleJournalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDailyData((prev) => ({
      ...prev,
      journalEntry: e.target.value,
    }));
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <header className="sticky top-0 z-50 flex justify-between items-center p-4 border-b bg-white">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Evolve"
            width={64}
            height={64}
            className="h-16 w-auto"
          />
          <h1 className="text-2xl font-bold">Evolve</h1>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="relative h-8 w-8 rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.image ?? ""}
                  alt={user?.name ?? "Profile picture"}
                />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-pink-500">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(event) => {
                event.preventDefault();
                signOut({
                  callbackUrl: `${window.location.origin}/login`,
                });
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <ScrollArea className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-8"
        >
          {isFetching && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-xl flex items-center space-x-4">
                <svg
                  className="animate-spin h-6 w-6 text-purple-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-gray-700">Loading data...</span>
              </div>
            </div>
          )}

          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <DatePickerComponent />
              <TemplateSheet
                onTemplateUpdate={() => fetchDailyData(selectedDate)}
              />

              <p className="text-sm text-gray-500">
                Today: {format(new Date(), "PPP")}
              </p>
            </div>

            <div className="text-center space-y-4 mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                Your Journey to Excellence
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Transform your life through daily discipline, positive thinking,
                and conscious growth.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Abstinence Card */}
              <Card className="bg-white/5 backdrop-blur-sm border-2 border-purple-500/20 shadow-xl h-fit">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-purple-500">
                    Abstinence
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Track your daily discipline
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dailyData.abstinenceItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={item.completed}
                            onCheckedChange={() =>
                              toggleAbstinenceItem(item.id)
                            }
                            className="border-purple-500"
                          />
                          <span
                            className={`${
                              item.completed
                                ? "line-through text-gray-400"
                                : "text-gray-700"
                            }`}
                          >
                            {item.text}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAbstinenceItem(item.id)}
                          className="hover:bg-red-100 hover:text-red-500"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-4">
                      <Input
                        placeholder="Add new commitment..."
                        value={newAbstinenceItem}
                        onChange={(e) => setNewAbstinenceItem(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && addAbstinenceItem()
                        }
                        className="border-purple-500/20 focus:border-purple-500"
                      />
                      <Button
                        onClick={addAbstinenceItem}
                        className="bg-purple-500 hover:bg-purple-600 text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Tasks Card */}
              <Card className="bg-white/5 backdrop-blur-sm border-2 border-blue-500/20 shadow-xl h-fit">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-blue-500">
                    Daily Tasks
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Track your daily progress
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dailyData.dailyTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleDailyTask(task.id)}
                            className="border-blue-500"
                          />
                          <span
                            className={`${
                              task.completed
                                ? "line-through text-gray-400"
                                : "text-gray-700"
                            }`}
                          >
                            {task.text}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteDailyTask(task.id)}
                          className="hover:bg-red-100 hover:text-red-500"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-4">
                      <Input
                        placeholder="Add new task..."
                        value={newDailyTask}
                        onChange={(e) => setNewDailyTask(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addDailyTask()}
                        className="border-blue-500/20 focus:border-blue-500"
                      />
                      <Button
                        onClick={addDailyTask}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Manifestation Card */}
              <Card className="bg-white/5 backdrop-blur-sm border-2 border-yellow-500/20 shadow-xl h-fit">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    Daily Manifestations
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Write 5 positive affirmations to manifest your desired
                    reality
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dailyData.manifestations.map((manifestation, index) => (
                      <div key={index} className="space-y-2">
                        <Input
                          placeholder={`Manifestation ${index + 1}: I am...`}
                          value={manifestation}
                          onChange={(e) =>
                            handleManifestationChange(index, e.target.value)
                          }
                          className="border-yellow-500/20 focus:border-yellow-500"
                        />
                      </div>
                    ))}
                    <Button
                      onClick={saveManifestations}
                      className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      Save Manifestations
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Journal Card */}

              <Card className="bg-white/5 backdrop-blur-sm border-2 border-emerald-500/20 shadow-xl lg:col-span-3">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-emerald-500">
                    Daily Journal
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Record your thoughts and reflections
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 p-4 bg-emerald-50 rounded-lg">
                    <p className="text-emerald-700 font-medium">
                      Today&apos;s Prompt: {dailyData.journalPrompt}
                    </p>
                  </div>
                  <Textarea
                    placeholder="Write your thoughts here..."
                    className="min-h-[150px] border-emerald-500/20 focus:border-emerald-500"
                    value={dailyData.journalEntry}
                    onChange={handleJournalChange}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Quote section */}
            <div className="text-center py-6">
              <blockquote className="italic text-gray-600 max-w-2xl mx-auto">
                &quot;Whatever the mind can conceive and believe, it can
                achieve.&quot; - Napoleon Hill
              </blockquote>
            </div>
            <SubmitAllButton />
          </div>
        </motion.div>
      </ScrollArea>
    </div>
  );
}
