"use client"

import { useLanguage } from "@/components/language-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSchedules } from "@/hooks/use-schedules"
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  Clock,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Pause,
  Play,
  RefreshCw,
  Search,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"


// interface SceduleSelectProps {
// templates: Schedules[]
// onChange: (categories: string) => void
// }

// Sample monitoring schedules data
// const schedules = [
//   {
//     id: "0",
//     name: "Climate Change Research",
//     description: "Monitor new research publications on climate change",
//     frequency: "Daily",
//     lastRun: "2023-10-14T08:30:00",
//     nextRun: "2023-10-15T08:30:00",
//     status: "active",
//     sources: 142,
//     newSources: 8,
//   },
// ]

export default function MonitoringPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { schedules, loading, error } = useSchedules()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Filter schedules based on active tab and search query
  const filteredSchedules = schedules
    .filter((schedule) => {
      if (activeTab === "all") return true
      if (activeTab === "active") return schedule.status === "active"
      if (activeTab === "paused") return schedule.status === "paused"
      if (activeTab === "error") return schedule.status === "error"
      return true
    })
    .filter((schedule) => {
      if (!searchQuery) return true
      return (
        schedule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">{t("common.active")}</Badge>
      case "paused":
        return <Badge variant="outline">{t("common.paused")}</Badge>
      case "error":
        return <Badge className="bg-destructive">{t("common.error")}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="py-8 px-8 flex flex-col items-center">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center">Analysis Monitoring</h1>
        <p className="text-muted-foreground mt-1 text-center">Manage your analyses</p>
      </div>

      <div className="flex flex-col justify-between  mb-6">
        <div className="flex w-full items-center space-x-3">
          <Input
            placeholder={`${t("common.search")}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
          <Button size="sm" variant="ghost" className="h-9">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">{t("monitoring.allSchedules")}</TabsTrigger>
          <TabsTrigger value="active">{t("monitoring.activeSchedules")}</TabsTrigger>
          <TabsTrigger value="paused">{t("monitoring.pausedSchedules")}</TabsTrigger>
          <TabsTrigger value="error">{t("monitoring.errorSchedules")}</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredSchedules.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20 p-4">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">{t("monitoring.noSchedulesFound")}</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? t("monitoring.noSchedulesMatch") : t("monitoring.noSchedulesYet")}
          </p>
          <Button onClick={() => router.push("/analysis/new")}>{t("monitoring.createFirstSchedule")}</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSchedules.map((schedule) => (
            <Card key={schedule.id} className="relative">
              <div className="absolute top-4 right-4">{getStatusBadge(schedule.status)}</div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      {schedule.name}
                    </CardTitle>
                    <CardDescription className="mt-1">{schedule.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="mt-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {/* <DropdownMenuItem onClick={() => router.push(`/monitoring/${schedule.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {t("monitoring.viewDetails")}
                      </DropdownMenuItem> */}
                      <DropdownMenuItem disabled>
                        <Edit className="mr-2 h-4 w-4" />
                        {t("common.edit")} {t("common.schedule")}
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {t("common.run")} {t("common.now")}
                      </DropdownMenuItem> */}
                      <DropdownMenuSeparator />
                      {/* {schedule.status === "active" ? (
                        <DropdownMenuItem>
                          <Pause className="mr-2 h-4 w-4" />
                          {t("common.pause")} {t("common.schedule")}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>
                          <Play className="mr-2 h-4 w-4" />
                          {t("common.resume")} {t("common.schedule")}
                        </DropdownMenuItem>
                      )} */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteConfirmId(schedule.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("common.delete")} {t("common.schedule")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      <span>{t(`common.${schedule.frequency.toLowerCase()}`)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {t("monitoring.nextRun")}: {new Date(schedule.nextRun).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {schedule.sources} {t("common.sources")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {schedule.newSources} {t("common.new")}
                      </span>
                    </div>
                  </div>

                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline" size="sm" onClick={() => router.push(`/analysis/results`)}>
                  <Eye className="mr-2 h-4 w-4" />
                  {t("monitoring.viewDetails")}
                </Button>
                {schedule.status === "active" ? (
                  <Button size="sm" variant="outline">
                    <Pause className="mr-2 h-4 w-4" />
                    {t("common.pause")}
                  </Button>
                ) : schedule.status === "paused" ? (
                  <Button size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    {t("common.resume")}
                  </Button>
                ) : (
                  <Button size="sm" variant="destructive">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    {t("monitoring.fixError")}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("monitoring.deleteSchedule")}</DialogTitle>
            <DialogDescription>{t("monitoring.deleteConfirm")}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">{t("monitoring.deleteWarning")}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // In a real app, this would delete the schedule
                setDeleteConfirmId(null)
              }}
            >
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

