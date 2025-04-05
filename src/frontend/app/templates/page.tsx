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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Trash2, Copy, Tag, FileText, Clock, CheckCircle2, AlertCircle, ChevronLeft } from "lucide-react"
import Link from "next/link"

// Sample template data
const templates = [
  {
    id: "1",
    name: "Default Template",
    description: "Standard classification template for general source analysis",
    categories: ["Source Type", "Content Type", "Impact Level", "Credibility"],
    classes: 14,
    lastUsed: "2 days ago",
    isDefault: true,
  },
  {
    id: "2",
    name: "Academic Sources",
    description: "Template optimized for academic and research papers",
    categories: ["Publication Type", "Research Method", "Citation Impact", "Field of Study"],
    classes: 18,
    lastUsed: "1 week ago",
    isDefault: false,
  },
  {
    id: "3",
    name: "News Sources",
    description: "Template for analyzing news articles and media sources",
    categories: ["Media Type", "Political Leaning", "Geographic Focus", "Topic"],
    classes: 16,
    lastUsed: "3 days ago",
    isDefault: false,
  },
  {
    id: "4",
    name: "Market Research",
    description: "Template for market analysis and business intelligence",
    categories: ["Industry Sector", "Market Position", "Data Quality", "Business Impact"],
    classes: 12,
    lastUsed: "2 weeks ago",
    isDefault: false,
  },
  {
    id: "5",
    name: "Social Media Analysis",
    description: "Template for analyzing social media content and engagement",
    categories: ["Platform", "Content Type", "Engagement Level", "Sentiment"],
    classes: 20,
    lastUsed: "1 month ago",
    isDefault: false,
  },
]

export default function TemplatesPage() {
  const router = useRouter()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateDescription, setNewTemplateDescription] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleCreateTemplate = () => {
    // In a real app, this would create a new template
    setIsCreateDialogOpen(false)
    setNewTemplateName("")
    setNewTemplateDescription("")
    // Navigate to template editor
    router.push("/templates/new")
  }

  const filteredTemplates =
    activeTab === "all"
      ? templates
      : activeTab === "default"
        ? templates.filter((t) => t.isDefault)
        : templates.filter((t) => !t.isDefault)

  return (
    <div className="flex flex-col py-8 px-8">
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
          <h1 className="text-3xl font-bold">Classification Templates</h1>
          <p className="text-muted-foreground mt-1">Manage and customize your source classification templates</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>Create a new classification template for your analyses</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  placeholder="Enter template name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  placeholder="Enter template description"
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Template Type</Label>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <input type="radio" id="blank" name="template-type" defaultChecked />
                    <Label htmlFor="blank" className="font-normal">
                      Start from blank
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" id="existing" name="template-type" />
                    <Label htmlFor="existing" className="font-normal">
                      Copy existing
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate} disabled={!newTemplateName.trim()}>
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="default">Default Templates</TabsTrigger>
          <TabsTrigger value="custom">Custom Templates</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="relative">
            {template.isDefault && <Badge className="absolute top-4 right-4 bg-primary">Default</Badge>}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    {template.name}
                  </CardTitle>
                  <CardDescription className="mt-1">{template.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/templates/${template.id}`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Template
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    {!template.isDefault && (
                      <>
                        <DropdownMenuItem>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Set as Default
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteConfirmId(template.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Template
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Categories</div>
                  <div className="flex flex-wrap gap-2">
                    {template.categories.map((category, i) => (
                      <Badge key={i} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{template.classes} classes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Used {template.lastUsed}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" size="sm" onClick={() => router.push(`/templates/${template.id}`)}>
                View Details
              </Button>
              <Button size="sm" onClick={() => router.push(`/analysis/new?template=${template.id}`)}>
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>This will permanently delete the template and remove it from all analyses that use it.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // In a real app, this would delete the template
                setDeleteConfirmId(null)
              }}
            >
              Delete Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

