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
  // const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  // const [newTemplateName, setNewTemplateName] = useState("")
  // const [newTemplateDescription, setNewTemplateDescription] = useState("")
  // const [activeTab, setActiveTab] = useState("all")
  // const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // const handleCreateTemplate = () => {
  //   // In a real app, this would create a new template
  //   setIsCreateDialogOpen(false)
  //   setNewTemplateName("")
  //   setNewTemplateDescription("")
  //   // Navigate to template editor
  //   router.push("/templates/new")
  // }

  // const filteredTemplates =
  //   activeTab === "all"
  //     ? templates
  //     : activeTab === "default"
  //       ? templates.filter((t) => t.isDefault)
  //       : templates.filter((t) => !t.isDefault)

  return (
    <div className="flex flex-col items-center py-8 px-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
          </Link>
        </Button>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center">Classification Templates</h1>
        <p className="text-muted-foreground mt-1 text-center">Manage your source classification templates</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
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
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between flex-col items-center">
              <Button size="sm" onClick={() => router.push(`/analysis/new?template=${template.id}`)}>
                Use Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

