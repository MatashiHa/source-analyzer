"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, Save, Plus, X, Tag, AlertCircle } from "lucide-react"

// Sample template data - in a real app, this would be fetched based on the ID
const templateData = {
  id: "1",
  name: "Default Template",
  description: "Standard classification template for general source analysis",
  isDefault: true,
  categories: [
    {
      name: "Source Type",
      classes: ["Primary", "Secondary", "Tertiary"],
    },
    {
      name: "Content Type",
      classes: ["Scientific", "Policy", "Economic", "Social", "Technical"],
    },
    {
      name: "Impact Level",
      classes: ["High Impact", "Medium Impact", "Low Impact"],
    },
    {
      name: "Credibility",
      classes: ["Highly Credible", "Credible", "Questionable"],
    },
  ],
}

export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const isNewTemplate = id === "new"

  const [template, setTemplate] = useState(templateData)
  const [templateName, setTemplateName] = useState(isNewTemplate ? "" : template.name)
  const [templateDescription, setTemplateDescription] = useState(isNewTemplate ? "" : template.description)
  const [isDefault, setIsDefault] = useState(template.isDefault)
  const [activeCategory, setActiveCategory] = useState(template.categories[0]?.name || "")
  const [newClassName, setNewClassName] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleSave = () => {
    // In a real app, this would save the template
    setHasUnsavedChanges(false)
    router.push("/templates")
  }

  const handleAddClass = () => {
    if (newClassName.trim() && activeCategory) {
      // In a real app, this would add the class to the selected category
      setNewClassName("")
      setHasUnsavedChanges(true)
    }
  }

  const handleRemoveClass = (categoryName: string, className: string) => {
    // In a real app, this would remove the class from the category
    setHasUnsavedChanges(true)
  }

  const handleAddCategory = () => {
    // In a real app, this would add a new category
    setHasUnsavedChanges(true)
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/templates" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {isNewTemplate ? "Create New Template" : `Edit Template: ${template.name}`}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isNewTemplate
              ? "Configure your new classification template"
              : "Modify your template structure and classes"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/templates")}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasUnsavedChanges && !isNewTemplate}>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
              <CardDescription>Basic information about your template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => {
                    setTemplateName(e.target.value)
                    setHasUnsavedChanges(true)
                  }}
                  placeholder="Enter template name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  value={templateDescription}
                  onChange={(e) => {
                    setTemplateDescription(e.target.value)
                    setHasUnsavedChanges(true)
                  }}
                  placeholder="Enter template description"
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="default-template">Default Template</Label>
                  <p className="text-sm text-muted-foreground">Use this template by default for new analyses</p>
                </div>
                <Switch
                  id="default-template"
                  checked={isDefault}
                  onCheckedChange={(checked) => {
                    setIsDefault(checked)
                    setHasUnsavedChanges(true)
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template Preview</CardTitle>
              <CardDescription>How your template will appear to users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-5 w-5 text-primary" />
                    <span className="font-medium">{templateName || "Untitled Template"}</span>
                  </div>

                  <div className="text-sm text-muted-foreground mb-4">
                    {templateDescription || "No description provided"}
                  </div>

                  <div className="space-y-3">
                    {template.categories.map((category, i) => (
                      <div key={i} className="space-y-1">
                        <div className="text-sm font-medium">{category.name}</div>
                        <div className="flex flex-wrap gap-1">
                          {category.classes.slice(0, 3).map((cls, j) => (
                            <Badge key={j} variant="outline">
                              {cls}
                            </Badge>
                          ))}
                          {category.classes.length > 3 && (
                            <Badge variant="outline">+{category.classes.length - 3} more</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  This template has {template.categories.reduce((acc, cat) => acc + cat.classes.length, 0)} total
                  classification options across {template.categories.length} categories.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Classification Structure</CardTitle>
              <CardDescription>Define categories and classes for your template</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue={template.categories[0]?.name}
                value={activeCategory}
                onValueChange={setActiveCategory}
              >
                <div className="flex items-center justify-between mb-4">
                  <TabsList className="h-auto p-1">
                    {template.categories.map((category, i) => (
                      <TabsTrigger key={i} value={category.name} className="text-xs px-3 py-1.5">
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <Button variant="outline" size="sm" onClick={handleAddCategory}>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Category
                  </Button>
                </div>

                {template.categories.map((category, i) => (
                  <TabsContent key={i} value={category.name} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.classes.length} classification options
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Rename
                        </Button>
                        {template.categories.length > 1 && (
                          <Button variant="outline" size="sm" className="text-destructive">
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {category.classes.map((cls, j) => (
                        <Badge key={j} variant="secondary" className="text-sm py-1.5 px-3">
                          {cls}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 -mr-1"
                            onClick={() => handleRemoveClass(category.name, cls)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Input
                        placeholder={`Add new ${category.name.toLowerCase()} class...`}
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        className="max-w-xs"
                      />
                      <Button onClick={handleAddClass} size="sm" disabled={!newClassName.trim()}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template Usage</CardTitle>
              <CardDescription>How this template will be applied to sources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-classify">Auto-classify sources</Label>
                  <Switch id="auto-classify" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically assign classes to sources based on content analysis
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="multi-class">Allow multiple classes per category</Label>
                  <Switch id="multi-class" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Sources can be assigned multiple classes within the same category
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="required-class">Require classification</Label>
                  <Switch id="required-class" />
                </div>
                <p className="text-sm text-muted-foreground">All sources must be classified in each category</p>
              </div>

              <div className="bg-muted/40 rounded-lg p-4 flex items-start gap-3 mt-4">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Template changes affect analyses</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Changes to this template will affect all analyses that use it. Adding or removing classes may
                    require reclassification of sources.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

