"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ChevronLeft,
  Edit,
  Play,
  Pause,
  RefreshCw,
  Trash2,
  Calendar,
  Bell,
  FileText,
  BarChart2,
  LineChart,
  ArrowUpRight,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Zap,
  Settings,
} from "lucide-react"
import { SourceVisualizations } from "@/components/source-visualizations"

// Sample monitoring schedule data - in a real app, this would be fetched based on the ID
const scheduleData = {
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
  keywords: [
    "climate change",
    "global warming",
    "carbon emissions",
    "renewable energy",
    "climate policy",
    "greenhouse gas",
    "sea level rise",
    "extreme weather",
    "climate adaptation",
    "climate mitigation",
  ],
  sourceTypes: ["Academic", "News", "Policy"],
  createdAt: "2023-08-15T10:00:00",
  createdBy: "John Doe",
  alertSettings: {
    newSources: true,
    keywordMatches: true,
    emailNotifications: true,
    slackNotifications: false,
    highPriorityOnly: true,
  },
  runHistory: [
    {
      id: "run-1",
      date: "2023-10-14T08:30:00",
      duration: "12 minutes",
      sourcesAnalyzed: 142,
      newSources: 8,
      alerts: 3,
      status: "completed",
    },
    {
      id: "run-2",
      date: "2023-10-13T08:30:00",
      duration: "10 minutes",
      sourcesAnalyzed: 138,
      newSources: 5,
      alerts: 1,
      status: "completed",
    },
    {
      id: "run-3",
      date: "2023-10-12T08:30:00",
      duration: "11 minutes",
      sourcesAnalyzed: 135,
      newSources: 7,
      alerts: 2,
      status: "completed",
    },
    {
      id: "run-4",
      date: "2023-10-11T08:30:00",
      duration: "9 minutes",
      sourcesAnalyzed: 130,
      newSources: 4,
      alerts: 0,
      status: "completed",
    },
    {
      id: "run-5",
      date: "2023-10-10T08:30:00",
      duration: "13 minutes",
      sourcesAnalyzed: 128,
      newSources: 6,
      alerts: 1,
      status: "completed",
    },
  ],
  alertHistory: [
    {
      id: "alert-1",
      date: "2023-10-14T09:15:00",
      type: "high_priority_keyword",
      source: "Nature Climate Change",
      title: "New study reveals accelerated ice sheet melting",
      description: "High priority keyword match: 'sea level rise'",
      status: "new",
    },
    {
      id: "alert-2",
      date: "2023-10-14T08:45:00",
      type: "new_source",
      source: "Science",
      title: "Breakthrough in carbon capture technology",
      description: "New high-impact source detected",
      status: "viewed",
    },
    {
      id: "alert-3",
      date: "2023-10-14T08:40:00",
      type: "high_priority_keyword",
      source: "UN Environment Programme",
      title: "New policy framework for climate adaptation",
      description: "High priority keyword match: 'climate adaptation'",
      status: "new",
    },
    {
      id: "alert-4",
      date: "2023-10-13T10:20:00",
      type: "high_priority_keyword",
      source: "IPCC",
      title: "Special report on climate mitigation strategies",
      description: "High priority keyword match: 'climate mitigation'",
      status: "viewed",
    },
  ],
}

export default function MonitoringDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const {id} = use(params)
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [scheduleName, setScheduleName] = useState(scheduleData.name)
  const [scheduleDescription, setScheduleDescription] = useState(scheduleData.description)
  const [scheduleFrequency, setScheduleFrequency] = useState(scheduleData.frequency.toLowerCase())
  const [scheduleKeywords, setScheduleKeywords] = useState(scheduleData.keywords.join(", "))
  const [selectedSourceTypes, setSelectedSourceTypes] = useState<string[]>(scheduleData.sourceTypes)
  const [alertSettings, setAlertSettings] = useState(scheduleData.alertSettings)
  const toggleSourceType = (type: string) => {
    setSelectedSourceTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleSaveChanges = () => {
    // In a real app, this would save the changes to the schedule
    setIsEditDialogOpen(false)
  }

  const handleRunNow = () => {
    // In a real app, this would trigger an immediate run of the schedule
    router.push(`/monitoring/${id}/running`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "paused":
        return <Badge variant="outline">Paused</Badge>
      case "error":
        return <Badge className="bg-destructive">Error</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "new":
        return <Badge className="bg-blue-500">New</Badge>
      case "viewed":
        return <Badge variant="outline">Viewed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="py-8 px-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/monitoring" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Monitoring
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{scheduleData.name}</h1>
            {getStatusBadge(scheduleData.status)}
          </div>
          <p className="text-muted-foreground mt-1">{scheduleData.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <Button onClick={handleRunNow}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Run Now
          </Button>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Monitoring Schedule</DialogTitle>
                <DialogDescription>Modify your automated monitoring schedule settings</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule-name">Schedule Name</Label>
                  <Input id="schedule-name" value={scheduleName} onChange={(e) => setScheduleName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule-description">Description</Label>
                  <Textarea
                    id="schedule-description"
                    value={scheduleDescription}
                    onChange={(e) => setScheduleDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule-frequency">Update Frequency</Label>
                  <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                    <SelectTrigger id="schedule-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule-keywords">Keywords</Label>
                  <Textarea
                    id="schedule-keywords"
                    value={scheduleKeywords}
                    onChange={(e) => setScheduleKeywords(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">Enter keywords separated by commas</p>
                </div>

                <div className="space-y-2">
                  <Label>Source Types to Monitor</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["Academic", "News", "Policy", "Market Reports", "Social Media", "Blogs"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Switch
                          id={`source-type-${type.toLowerCase().replace(/\s+/g, "-")}`}
                          checked={selectedSourceTypes.includes(type)}
                          onCheckedChange={() => toggleSourceType(type)}
                        />
                        <Label
                          htmlFor={`source-type-${type.toLowerCase().replace(/\s+/g, "-")}`}
                          className="font-normal"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Alert Settings</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="alert-new-sources"
                        checked={alertSettings.newSources}
                        onCheckedChange={(checked) => setAlertSettings((prev) => ({ ...prev, newSources: checked }))}
                      />
                      <Label htmlFor="alert-new-sources" className="font-normal">
                        Alert on new sources
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="alert-keywords"
                        checked={alertSettings.keywordMatches}
                        onCheckedChange={(checked) =>
                          setAlertSettings((prev) => ({ ...prev, keywordMatches: checked }))
                        }
                      />
                      <Label htmlFor="alert-keywords" className="font-normal">
                        Alert on keyword matches
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="alert-email"
                        checked={alertSettings.emailNotifications}
                        onCheckedChange={(checked) =>
                          setAlertSettings((prev) => ({ ...prev, emailNotifications: checked }))
                        }
                      />
                      <Label htmlFor="alert-email" className="font-normal">
                        Send email notifications
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges} disabled={!scheduleName.trim()}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {scheduleData.status === "active" ? (
            <Button variant="outline">
              <Pause className="mr-2 h-4 w-4" />
              Pause Schedule
            </Button>
          ) : (
            <Button variant="outline">
              <Play className="mr-2 h-4 w-4" />
              Resume Schedule
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">Frequency</div>
                <div className="text-lg font-bold">{scheduleData.frequency}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">Next Run</div>
                <div className="text-lg font-bold">{new Date(scheduleData.nextRun).toLocaleDateString()}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(scheduleData.nextRun).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">Total Sources</div>
                <div className="text-lg font-bold">{scheduleData.sources}</div>
                <div className="text-xs text-green-600">+{scheduleData.newSources} new</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                {scheduleData.alertHistory.map((alert) => (
                  <div key={alert.id} className="border p-3 rounded-lg">
                    <h3 className="font-medium">{alert.title}</h3>
                    <p className="text-sm">{alert.description}</p>
                    <span className="text-xs text-amber-600">{alert.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="history">Run History</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Overview</CardTitle>
              <CardDescription>Summary of monitoring activity and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Source Trends</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Last 7 Days
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <LineChart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <SourceVisualizations />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Recent Alerts</h3>
                    <div className="space-y-3">
                      {scheduleData.alertHistory.slice(0, 3).map((alert) => (
                        <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                          {alert.type === "high_priority_keyword" ? (
                            <Zap className="h-5 w-5 text-amber-500 mt-0.5" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-blue-500 mt-0.5" />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{alert.title}</div>
                              {getStatusBadge(alert.status)}
                            </div>
                            <div className="text-sm text-muted-foreground">{alert.source}</div>
                            <div className="text-sm mt-1">{alert.description}</div>
                          </div>
                        </div>
                      ))}
                      {scheduleData.alertHistory.length > 3 && (
                        <Button variant="ghost" className="w-full text-sm" onClick={() => setActiveTab("alerts")}>
                          View all {scheduleData.alertHistory.length} alerts
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Monitoring Configuration</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Keywords</div>
                        <div className="flex flex-wrap gap-1">
                          {scheduleData.keywords.map((keyword, i) => (
                            <Badge key={i} variant="outline">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-medium">Source Types</div>
                        <div className="flex flex-wrap gap-1">
                          {scheduleData.sourceTypes.map((type, i) => (
                            <Badge key={i} variant="secondary">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-medium">Alert Settings</div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Alert on new sources</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Alert on high-priority keywords</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Email notifications enabled</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Alerts</CardTitle>
              <CardDescription>Alerts generated from your monitoring schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Input placeholder="Search alerts..." className="w-[250px] h-9" />
                  <Button size="sm" variant="ghost" className="h-9 px-2">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {scheduleData.alertHistory.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-4 rounded-lg border">
                    {alert.type === "high_priority_keyword" ? (
                      <Zap className="h-5 w-5 text-amber-500 mt-0.5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-blue-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{alert.title}</div>
                          {getStatusBadge(alert.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">{new Date(alert.date).toLocaleString()}</div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{alert.source}</div>
                      <div className="text-sm mt-2">{alert.description}</div>
                      <div className="flex justify-end gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          Mark as Viewed
                        </Button>
                        <Button size="sm">View Source</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Run History</CardTitle>
              <CardDescription>History of monitoring schedule executions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Sources</TableHead>
                      <TableHead>New Sources</TableHead>
                      <TableHead>Alerts</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduleData.runHistory.map((run) => (
                      <TableRow key={run.id}>
                        <TableCell>{new Date(run.date).toLocaleString()}</TableCell>
                        <TableCell>{run.duration}</TableCell>
                        <TableCell>{run.sourcesAnalyzed}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {run.newSources}
                            {run.newSources > 0 && <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {run.alerts}
                            {run.alerts > 0 && <Bell className="h-3.5 w-3.5 text-amber-500" />}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(run.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Results
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monitored Sources</CardTitle>
              <CardDescription>Sources tracked by this monitoring schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Input placeholder="Search sources..." className="w-[250px] h-9" />
                  <Button size="sm" variant="ghost" className="h-9 px-2">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Added Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Relevance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Sample source data - would be dynamically generated in a real app */}
                    {[
                      {
                        id: 1,
                        name: "Nature Climate Change",
                        type: "Academic",
                        date: "2023-10-14",
                        status: "new",
                        relevance: 95,
                      },
                      { id: 2, name: "Science", type: "Academic", date: "2023-10-14", status: "new", relevance: 92 },
                      {
                        id: 3,
                        name: "UN Environment Programme",
                        type: "Policy",
                        date: "2023-10-14",
                        status: "new",
                        relevance: 88,
                      },
                      {
                        id: 4,
                        name: "The Guardian - Climate",
                        type: "News",
                        date: "2023-10-13",
                        status: "active",
                        relevance: 85,
                      },
                      { id: 5, name: "IPCC", type: "Policy", date: "2023-10-13", status: "active", relevance: 90 },
                    ].map((source) => (
                      <TableRow key={source.id}>
                        <TableCell className="font-medium">{source.name}</TableCell>
                        <TableCell>{source.type}</TableCell>
                        <TableCell>{source.date}</TableCell>
                        <TableCell>{getStatusBadge(source.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-10 text-right">{source.relevance}%</div>
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${source.relevance}%` }} />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Source
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Settings</CardTitle>
              <CardDescription>Configure your monitoring schedule settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">General Settings</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="setting-active">Active Status</Label>
                        <Switch id="setting-active" defaultChecked={scheduleData.status === "active"} />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <Label htmlFor="setting-frequency" className="block">
                            Frequency
                          </Label>
                          <p className="text-sm text-muted-foreground">How often the schedule runs</p>
                        </div>
                        <Select defaultValue={scheduleData.frequency.toLowerCase()}>
                          <SelectTrigger className="w-[180px]" id="setting-frequency">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <Label htmlFor="setting-retention" className="block">
                            Data Retention
                          </Label>
                          <p className="text-sm text-muted-foreground">How long to keep monitoring data</p>
                        </div>
                        <Select defaultValue="90">
                          <SelectTrigger className="w-[180px]" id="setting-retention">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="180">180 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                            <SelectItem value="unlimited">Unlimited</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Alert Settings</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="setting-alert-new">Alert on New Sources</Label>
                        <Switch id="setting-alert-new" defaultChecked={scheduleData.alertSettings.newSources} />
                      </div>
                      <div className="flex justify-between items-center">
                        <Label htmlFor="setting-alert-keywords">Alert on Keyword Matches</Label>
                        <Switch
                          id="setting-alert-keywords"
                          defaultChecked={scheduleData.alertSettings.keywordMatches}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <Label htmlFor="setting-alert-priority">High Priority Only</Label>
                        <Switch
                          id="setting-alert-priority"
                          defaultChecked={scheduleData.alertSettings.highPriorityOnly}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Notification Settings</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="setting-email">Email Notifications</Label>
                        <Switch id="setting-email" defaultChecked={scheduleData.alertSettings.emailNotifications} />
                      </div>
                      <div className="flex justify-between items-center">
                        <Label htmlFor="setting-slack">Slack Notifications</Label>
                        <Switch id="setting-slack" defaultChecked={scheduleData.alertSettings.slackNotifications} />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <Label htmlFor="setting-digest" className="block">
                            Digest Frequency
                          </Label>
                          <p className="text-sm text-muted-foreground">How often to send summary digests</p>
                        </div>
                        <Select defaultValue="daily">
                          <SelectTrigger className="w-[180px]" id="setting-digest">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realtime">Real-time</SelectItem>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Advanced Settings</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <Label htmlFor="setting-classification" className="block">
                            Classification Template
                          </Label>
                          <p className="text-sm text-muted-foreground">Template for source classification</p>
                        </div>
                        <Select defaultValue="default">
                          <SelectTrigger className="w-[180px]" id="setting-classification">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default Template</SelectItem>
                            <SelectItem value="academic">Academic Sources</SelectItem>
                            <SelectItem value="news">News Sources</SelectItem>
                            <SelectItem value="custom">Custom Template</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label htmlFor="setting-auto-analyze">Auto-analyze New Sources</Label>
                        <Switch id="setting-auto-analyze" defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <Label htmlFor="setting-auto-classify">Auto-classify Sources</Label>
                        <Switch id="setting-auto-classify" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 flex justify-between">
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Schedule
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>
                    <Settings className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

