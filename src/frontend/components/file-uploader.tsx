"use client"

import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Upload, X, FileText, File, Image } from "lucide-react"

export function FileUploader() {
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Ensure component is mounted before any DOM interactions
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleBrowseClick = () => {
    // Only access DOM when component is mounted and ref exists
    if (isMounted && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const getFileIcon = (file: File) => {
    const fileType = file.type
    if (fileType.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-500" />
    } else if (fileType.includes("image")) {
      return <Image className="h-5 w-5 text-blue-500" />
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return <FileText className="h-5 w-5 text-blue-500" />
    } else {
      return <File className="h-5 w-5 text-gray-500" />
    }
  }

  if (!isMounted) {
    return <div className="h-[200px] bg-muted/40 rounded-lg flex items-center justify-center">Loading uploader...</div>
  }

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={handleBrowseClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept=".txt,.pdf,.docx"
          className="hidden"
        />
        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-1">Upload Files</h3>
        <p className="text-sm text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleBrowseClick()
          }}
        >
          Select Files
        </Button>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-muted/40 rounded-lg p-3">
              <div className="flex items-center gap-3">
                {getFileIcon(file)}
                <div className="text-sm">
                  <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFile(index)
                }}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

