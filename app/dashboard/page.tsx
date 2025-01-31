"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import Header from "@/components/header";
import Loading from "@/components/loading";
import Abstinence from "@/components/abstinence";
import DailyTasks from "@/components/daily-tasks";
import Manifestation from "@/components/manifestation";
import Journal from "@/components/journal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDailyDashboard } from "@/hooks/use-daily-dashboard";
import SubmitAllButton from "@/components/submit-all-button";
import DatePicker from "@/components/date-picker";
import { TemplateSheet } from "@/components/template-sheet";
import { Sparkles, Quote } from "lucide-react";

export default function DashboardPage() {
  const session = useSession();
  const user = session.data?.user;

  const {
    isFetching,
    isSaving,
    dailyData,
    selectedDate,
    newAbstinenceItem,
    newDailyTask,
    saveAllData,
    handleDateChange,
    deleteAbstinenceItem,
    deleteDailyTask,
    addAbstinenceItem,
    addDailyTask,
    handleManifestationChange,
    toggleAbstinenceItem,
    toggleDailyTask,
    setNewAbstinenceItem,
    setNewDailyTask,
    handleJournalChange,
    fetchDailyData,
  } = useDailyDashboard();

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-background via-background/98 to-background/95">
      <Header user={user} />

      <ScrollArea className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-2 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8"
        >
          {isFetching && <Loading />}

          <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Top Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <DatePicker
                  selectedDate={selectedDate}
                  handleDateChange={handleDateChange}
                />
                <TemplateSheet
                  onTemplateUpdate={() => fetchDailyData(selectedDate)}
                />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Today: {format(new Date(), "PPP")}
              </p>
            </div>

            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative space-y-3 sm:space-y-4 text-center py-4 sm:py-6"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 blur-3xl" />
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-primary" />
                <h1
                  className="bg-gradient-to-r text-primary bg-clip-text 
                  text-2xl sm:text-3xl lg:text-4xl font-bold "
                >
                  Your Journey to Excellence
                </h1>
              </div>
              <p className="mx-auto max-w-2xl text-xs sm:text-sm text-muted-foreground px-2">
                Transform your life through daily discipline, positive thinking,
                and conscious growth.
              </p>
            </motion.div>

            {/* Main Grid */}
            <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full"
              >
                <Abstinence
                  dailyData={dailyData}
                  toggleAbstinenceItem={toggleAbstinenceItem}
                  deleteAbstinenceItem={deleteAbstinenceItem}
                  setNewAbstinenceItem={setNewAbstinenceItem}
                  addAbstinenceItem={addAbstinenceItem}
                  newAbstinenceItem={newAbstinenceItem}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full"
              >
                <DailyTasks
                  dailyData={dailyData}
                  toggleDailyTask={toggleDailyTask}
                  deleteDailyTask={deleteDailyTask}
                  newDailyTask={newDailyTask}
                  setNewDailyTask={setNewDailyTask}
                  addDailyTask={addDailyTask}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full"
              >
                <Manifestation
                  dailyData={dailyData}
                  handleManifestationChange={handleManifestationChange}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="w-full sm:col-span-2 lg:col-span-3"
              >
                <Journal
                  dailyData={dailyData}
                  handleJournalChange={handleJournalChange}
                />
              </motion.div>
            </div>

            {/* Quote Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="relative mx-auto max-w-2xl rounded-lg bg-card/50 p-4 sm:p-6 text-center shadow-sm"
            >
              <Quote className="mx-auto mb-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary/60" />
              <blockquote className="text-xs sm:text-sm text-muted-foreground">
                &quot;Whatever the mind can conceive and believe, it can
                achieve.&quot;
                <footer className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-primary/80">
                  - Napoleon Hill
                </footer>
              </blockquote>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-2 sm:pt-4"
            >
              <SubmitAllButton saveAllData={saveAllData} isSaving={isSaving} />
            </motion.div>
          </div>
        </motion.div>
      </ScrollArea>
    </div>
  );
}
