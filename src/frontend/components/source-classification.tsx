"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Save, Tag, Edit2 } from "lucide-react"

export function SourceClassification() {
  const [newClass, setNewClass] = useState("")

  const classGroups = [
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
  ]

  const handleAddClass = () => {
    if (newClass.trim()) {
      // In a real app, this would add the class to the selected group
      setNewClass("")
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Classification Template</CardTitle>
            <CardDescription>Current template: Default Template</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="source-type">
              <TabsList className="grid grid-cols-4">
                {classGroups.map((group) => (
                  <TabsTrigger key={group.name} value={group.name.toLowerCase().replace(/\s+/g, "-")}>
                    {group.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {classGroups.map((group) => (
                <TabsContent key={group.name} value={group.name.toLowerCase().replace(/\s+/g, "-")} className="pt-4">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {group.classes.map((cls) => (
                        <Badge key={cls} variant="secondary" className="text-sm py-1 px-3">
                          {cls}
                          <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 -mr-1">
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder={`Add new ${group.name.toLowerCase()} class...`}
                        value={newClass}
                        onChange={(e) => setNewClass(e.target.value)}
                        className="max-w-xs"
                      />
                      <Button onClick={handleAddClass} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classification Statistics</CardTitle>
            <CardDescription>Distribution of sources across classification categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {classGroups.map((group) => (
                <div key={group.name} className="space-y-2">
                  <h4 className="font-medium text-sm">{group.name}</h4>
                  <div className="space-y-2">
                    {group.classes.map((cls) => {
                      // Random percentage for demo
                      const percentage = Math.floor(Math.random() * 100)
                      return (
                        <div key={cls} className="flex items-center gap-2">
                          <div className="w-32 text-sm">{cls}</div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                          </div>
                          <div className="w-10 text-sm text-right">{percentage}%</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Template Management</CardTitle>
            <CardDescription>Save and load classification templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Current Template</h4>
                <div className="flex items-center justify-between bg-muted/40 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <span>Default Template</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Saved Templates</h4>
                <div className="space-y-2">
                  {["Academic Sources", "News Sources", "Market Research"].map((template) => (
                    <div key={template} className="flex items-center justify-between bg-muted/40 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <span>{template}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Load
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Current Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classification Actions</CardTitle>
            <CardDescription>Apply classification to sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full" variant="outline">
                Auto-Classify All Sources
              </Button>
              <Button className="w-full" variant="outline">
                Reset Classification
              </Button>
              <Button className="w-full" variant="outline">
                Apply Template to Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

