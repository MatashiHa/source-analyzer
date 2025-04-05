"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, X, ArrowUp, ArrowDown } from "lucide-react"

type ClassItem = {
  id: string
  name: string
}

type CategoryItem = {
  id: string
  name: string
  classes: ClassItem[]
}

type TemplateEditorProps = {
  initialCategories?: CategoryItem[]
  onChange?: (categories: CategoryItem[]) => void
}

export function TemplateEditor({ initialCategories = [], onChange }: TemplateEditorProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(
    initialCategories.length > 0 ? initialCategories : [{ id: "1", name: "New Category", classes: [] }],
  )
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newClassName, setNewClassName] = useState("")
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id || "")

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: Date.now().toString(),
        name: newCategoryName,
        classes: [],
      }
      const updatedCategories = [...categories, newCategory]
      setCategories(updatedCategories)
      setNewCategoryName("")
      setActiveCategoryId(newCategory.id)
      onChange?.(updatedCategories)
    }
  }

  const handleRemoveCategory = (categoryId: string) => {
    const updatedCategories = categories.filter((cat) => cat.id !== categoryId)
    setCategories(updatedCategories)

    if (activeCategoryId === categoryId) {
      setActiveCategoryId(updatedCategories[0]?.id || "")
    }

    onChange?.(updatedCategories)
  }

  const handleAddClass = (categoryId: string) => {
    if (newClassName.trim()) {
      const updatedCategories = categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            classes: [...cat.classes, { id: Date.now().toString(), name: newClassName }],
          }
        }
        return cat
      })

      setCategories(updatedCategories)
      setNewClassName("")
      onChange?.(updatedCategories)
    }
  }

  const handleRemoveClass = (categoryId: string, classId: string) => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          classes: cat.classes.filter((cls) => cls.id !== classId),
        }
      }
      return cat
    })

    setCategories(updatedCategories)
    onChange?.(updatedCategories)
  }

  const handleMoveCategory = (categoryId: string, direction: "up" | "down") => {
    const categoryIndex = categories.findIndex((cat) => cat.id === categoryId)
    if (
      (direction === "up" && categoryIndex === 0) ||
      (direction === "down" && categoryIndex === categories.length - 1)
    ) {
      return
    }

    const newIndex = direction === "up" ? categoryIndex - 1 : categoryIndex + 1
    const updatedCategories = [...categories]
    const [movedCategory] = updatedCategories.splice(categoryIndex, 1)
    updatedCategories.splice(newIndex, 0, movedCategory)

    setCategories(updatedCategories)
    onChange?.(updatedCategories)
  }

  const activeCategory = categories.find((cat) => cat.id === activeCategoryId)

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
          <Plus className="h-4 w-4 mr-1" />
          Add Category
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                  category.id === activeCategoryId ? "bg-muted font-medium" : "hover:bg-muted/50"
                }`}
                onClick={() => setActiveCategoryId(category.id)}
              >
                <span>{category.name}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMoveCategory(category.id, "up")
                    }}
                    disabled={categories.indexOf(category) === 0}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMoveCategory(category.id, "down")
                    }}
                    disabled={categories.indexOf(category) === categories.length - 1}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveCategory(category.id)
                    }}
                    disabled={categories.length <= 1}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 space-y-4">
          {activeCategory ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Classes for {activeCategory.name}</h3>
                <div className="text-xs text-muted-foreground">{activeCategory.classes.length} classes</div>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeCategory.classes.map((cls) => (
                  <Badge key={cls.id} variant="secondary" className="text-sm py-1.5 px-3">
                    {cls.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 -mr-1"
                      onClick={() => handleRemoveClass(activeCategory.id, cls.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}

                {activeCategory.classes.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No classes defined yet. Add your first class below.
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Input
                  placeholder={`Add new class to ${activeCategory.name}...`}
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
                <Button onClick={() => handleAddClass(activeCategory.id)} disabled={!newClassName.trim()}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Class
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              Select a category or create a new one to manage classes
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

