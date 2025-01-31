import { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "sonner";
import { journalPrompts } from "@/questions";

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
  journalPrompt: string;
}
declare global {
  interface Date {
    getDayOfYear(): number;
  }
}
Date.prototype.getDayOfYear = function () {
  const start = new Date(this.getFullYear(), 0, 0);
  const diff =
    this.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - this.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};
export const useDailyDashboard = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newAbstinenceItem, setNewAbstinenceItem] = useState<string>("");
  const [newDailyTask, setNewDailyTask] = useState<string>("");
  const [dailyData, setDailyData] = useState<DailyData>({
    date: format(new Date(), "yyyy-MM-dd"),
    abstinenceItems: [],
    dailyTasks: [],
    manifestations: Array(5).fill(""),
    journalEntry: "",
    journalPrompt: journalPrompts[new Date().getDayOfYear() - 1],
  });

  const fetchDailyData = async (date: Date) => {
    try {
      setIsFetching(true);
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await axios.get(`/api/daily-data/${formattedDate}`);
      const dayOfYear = date.getDayOfYear() - 1;

      setDailyData({
        ...response.data,
        journalPrompt: response.data.journalPrompt || journalPrompts[dayOfYear],
      });
    } catch (error) {
      console.error(error);
      const dayOfYear = date.getDayOfYear() - 1;
      setDailyData({
        date: format(date, "yyyy-MM-dd"),
        abstinenceItems: [],
        dailyTasks: [],
        manifestations: Array(5).fill(""),
        journalEntry: "",
        journalPrompt: journalPrompts[dayOfYear],
      });
      toast.error("Failed to fetch data", { position: "top-center" });
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
      toast.success("All data saved successfully!", { position: "top-center" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save data", { position: "top-center" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      fetchDailyData(date);
    }
  };

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
    setDailyData((prev) => ({
      ...prev,
      manifestations: prev.manifestations.map((m, i) =>
        i === index ? value : m
      ),
    }));
  };

  const saveManifestations = () => {
    if (dailyData.manifestations.every((m) => m.trim())) {
      toast.success("Daily manifestations saved!", { position: "top-center" });
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

  const handleJournalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDailyData((prev) => ({
      ...prev,
      journalEntry: e.target.value,
    }));
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

  // Initial data fetch
  useEffect(() => {
    fetchDailyData(new Date());
  }, []);

  return {
    dailyData,
    isFetching,
    isSaving,
    selectedDate,
    newAbstinenceItem,
    newDailyTask,
    handleDateChange,
    saveAllData,
    deleteAbstinenceItem,
    deleteDailyTask,
    addAbstinenceItem,
    addDailyTask,
    setNewAbstinenceItem,
    setNewDailyTask,
    handleManifestationChange,
    saveManifestations,
    toggleAbstinenceItem,
    toggleDailyTask,
    handleJournalChange,
    fetchDailyData,
    setDailyData,
  };
};
