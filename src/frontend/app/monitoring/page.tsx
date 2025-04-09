"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Clock,
  Calendar,
  Bell,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Trash2,
  AlertCircle,
  RefreshCw,
  Eye,
  FileText,
  ArrowUpRight,
  ChevronLeft,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import Link from "next/link"

// Sample monitoring schedules data
const schedules = [
  {
    id: "1",
    name: "Climate Change Research",
    description: "Monitor new research publications on climate change",
    frequency: "Daily",
    lastRun: "2023-10-14T08:30:00",
    nextRun: "2023-10-15T08:30:00",
    status: "active",
    sources: 142,
    newSources: 8,
    alerts: 3,
    keywords: ["climate change", "global warming", "carbon emissions", "renewable energy"],
    sourceTypes: ["Academic", "News", "Policy"],
  },
  {
    id: "2",
    name: "Market Trends Analysis",
    description: "Track market trends in renewable energy sector",
    frequency: "Weekly",
    lastRun: "2023-10-10T10:00:00",
    nextRun: "2023-10-17T10:00:00",
    status: "active",
    sources: 87,
    newSources: 12,
    alerts: 1,
    keywords: ["renewable energy", "market trends", "solar power", "wind energy", "investment"],
    sourceTypes: ["News", "Market Reports", "Company Releases"],
  },
  {
    id: "3",
    name: "Competitor Analysis",
    description: "Monitor competitor activities and announcements",
    frequency: "Daily",
    lastRun: "2023-10-14T09:15:00",
    nextRun: "2023-10-15T09:15:00",
    status: "paused",
    sources: 56,
    newSources: 0,
    alerts: 0,
    keywords: ["competitor name", "product launch", "merger", "acquisition", "partnership"],
    sourceTypes: ["News", "Press Releases", "Social Media"],
  },
  {
    id: "4",
    name: "Policy Changes",
    description: "Track policy changes related to environmental regulations",
    frequency: "Weekly",
    lastRun: "2023-10-08T14:00:00",
    nextRun: "2023-10-15T14:00:00",
    status: "active",
    sources: 34,
    newSources: 5,
    alerts: 2,
    keywords: ["environmental policy", "regulation", "legislation", "compliance", "government"],
    sourceTypes: ["Policy Documents", "News", "Government Releases"],
  },
  {
    id: "5",
    name: "Technology Innovations",
    description: "Monitor new technological innovations in clean energy",
    frequency: "Bi-weekly",
    lastRun: "2023-10-01T11:30:00",
    nextRun: "2023-10-15T11:30:00",
    status: "active",
    sources: 78,
    newSources: 15,
    alerts: 4,
    keywords: ["clean energy", "innovation", "technology", "breakthrough", "patent"],
    sourceTypes: ["Academic", "News", "Patents", "Research Reports"],
  },
  {
    id: "6",
    name: "Social Media Sentiment",
    description: "Track social media sentiment on climate change topics",
    frequency: "Daily",
    lastRun: "2023-10-14T16:00:00",
    nextRun: "2023-10-15T16:00:00",
    status: "error",
    sources: 215,
    newSources: 0,
    alerts: 1,
    keywords: ["climate change", "global warming", "opinion", "sentiment", "public reaction"],
    sourceTypes: ["Social Media", "Blogs", "Forums"],
  },
]

// Frequency options
const frequencyOptions = ["Hourly", "Daily", "Weekly", "Bi-weekly", "Monthly", "Quarterly"]

// Source type options
const sourceTypeOptions = [
  "Academic",
  "News",
  "Policy Documents",
  "Market Reports",
  "Social Media",
  "Blogs",
  "Press Releases",
  "Patents",
  "Government Releases",
  "Company Releases",
  "Forums",
]

export default function MonitoringPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newScheduleName, setNewScheduleName] = useState("")
  const [newScheduleDescription, setNewScheduleDescription] = useState("")
  const [newScheduleFrequency, setNewScheduleFrequency] = useState("")
  const [newScheduleKeywords, setNewScheduleKeywords] = useState("")
  const [selectedSourceTypes, setSelectedSourceTypes] = useState<string[]>([])
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
        schedule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })

  const handleCreateSchedule = () => {
    // In a real app, this would create a new monitoring schedule
    setIsCreateDialogOpen(false)
    setNewScheduleName("")
    setNewScheduleDescription("")
    setNewScheduleFrequency("")
    setNewScheduleKeywords("")
    setSelectedSourceTypes([])
    // Navigate to the new schedule or refresh the list
  }

  const toggleSourceType = (type: string) => {
    setSelectedSourceTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleRunNow = () => {
    // In a real app, this would trigger all active schedules to run
    alert("Running all active monitoring schedules")
    // You could also navigate to a page showing all running schedules
    // router.push("/monitoring/running-all")
  }

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

  return (
    <div className="py-8 px-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t("monitoring.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("monitoring.subtitle")}</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("monitoring.createSchedule")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t("monitoring.createSchedule")}</DialogTitle>
              <DialogDescription>{t("monitoring.subtitle")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-name">{t("common.name")}</Label>
                <Input
                  id="schedule-name"
                  placeholder={t("common.name")}
                  value={newScheduleName}
                  onChange={(e) => setNewScheduleName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule-description">{t("common.description")}</Label>
                <Textarea
                  id="schedule-description"
                  placeholder={t("common.description")}
                  value={newScheduleDescription}
                  onChange={(e) => setNewScheduleDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule-frequency">{t("common.frequency")}</Label>
                <Select value={newScheduleFrequency} onValueChange={setNewScheduleFrequency}>
                  <SelectTrigger id="schedule-frequency">
                    <SelectValue placeholder={t("common.frequency")} />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((option) => (
                      <SelectItem key={option} value={option.toLowerCase()}>
                        {t(`common.${option.toLowerCase()}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule-keywords">{t("common.keywords")}</Label>
                <Textarea
                  id="schedule-keywords"
                  placeholder={t("common.keywords")}
                  value={newScheduleKeywords}
                  onChange={(e) => setNewScheduleKeywords(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("common.sources")}</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {sourceTypeOptions.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Switch
                        id={`source-type-${type.toLowerCase().replace(/\s+/g, "-")}`}
                        checked={selectedSourceTypes.includes(type)}
                        onCheckedChange={() => toggleSourceType(type)}
                      />
                      <Label htmlFor={`source-type-${type.toLowerCase().replace(/\s+/g, "-")}`} className="font-normal">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="space-y-2">
                <Label>{t("common.alerts")}</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="alert-new-sources" defaultChecked />
                    <Label htmlFor="alert-new-sources" className="font-normal">
                      {t("monitoring.alertsDetected")}
                    </Label>
                  </div>
                </div>
              </div> */}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleCreateSchedule}
                disabled={!newScheduleName.trim() || !newScheduleFrequency || selectedSourceTypes.length === 0}
              >
                {t("common.create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder={`${t("common.search")}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
          <Button size="sm" variant="ghost" className="h-9 px-2">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            {t("common.filter")}
          </Button>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              <SelectItem value="next_run">Next Run Time</SelectItem>
            </SelectContent>
          </Select>
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
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">{t("monitoring.noSchedulesFound")}</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? t("monitoring.noSchedulesMatch") : t("monitoring.noSchedulesYet")}
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>{t("monitoring.createFirstSchedule")}</Button>
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
                    <DropdownMenuTrigger asChild className="mt-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {/* <DropdownMenuItem onClick={() => router.push(`/monitoring/${schedule.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {t("monitoring.viewDetails")}
                      </DropdownMenuItem> */}
                      <DropdownMenuItem>
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

                  {/* {schedule.alerts > 0 && (
                    <div className="flex items-center gap-2 text-sm bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 rounded-md p-2">
                      <Bell className="h-4 w-4" />
                      <span>
                        {schedule.alerts}{" "}
                        {schedule.alerts === 1 ? t("monitoring.alertDetected") : t("monitoring.alertsDetected")}
                      </span>
                    </div>
                  )} */}

                  {/* <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground">{t("common.keywords")}</div>
                    <div className="flex flex-wrap gap-1">
                      {schedule.keywords.slice(0, 3).map((keyword, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {schedule.keywords.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{schedule.keywords.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div> */}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline" size="sm" onClick={() => router.push(`/monitoring/${schedule.id}`)}>
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

