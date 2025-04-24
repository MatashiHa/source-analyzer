"use client"

import { useState, useRef, useEffect } from "react"
import type React from "react"
import { extractRawText } from "mammoth"
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { Button } from "@/components/ui/button"
import { Upload, X, FileText, File, Image, Loader2 } from "lucide-react"
import api from "@/lib/api"


export function FileUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [message, setMessage] = useState({text: "", type: ""})
  const [isLoading, setIsLoading] = useState(false)

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

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragging) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    // Only set isDragging to false if we're leaving the dropzone (not entering a child element)
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...droppedFiles])
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

  const extractText = async (file: File): Promise<string> => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    try {
      if (extension === 'txt') {
        return await readTextFile(file);
      } else if (extension === 'docx') {
        return await readDocxFile(file);
      } else if (extension === 'pdf') {
        return await readPdfFile(file);
      } else {
        throw new Error('Unsupported data format.');
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!files) {
      setMessage({ text: 'Please, choose files', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Извлечение текста из файла
      const fileText = await extractText(files[0]);
      // setPreviewText(fileText.substring(0, 500) + (fileText.length > 500 ? '...' : ''));

      // Отправка на сервер
      const response = await api.post('/documents/process', {
        filename: files[0].name,
        content: fileText,
        fileType: files[0].type
      });

      setMessage({ 
        text: 'File data is loaded to DB!', 
        type: 'success' 
      });
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ 
        text: error instanceof Error ? error.message : 'Error occured while loading the file', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error('Error occured while reading file'));
      reader.readAsText(file);
    });
  };

  const readDocxFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await extractRawText({ arrayBuffer });
    return result.value;
  };

  const readPdfFile = async (file: File): Promise<string> => {
    // const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
    // pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = getDocument(arrayBuffer);
    const pdf = await loadingTask.promise
    
    let text = '';
    for (let i = 0; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }

    return text;
  };

  if (!isMounted) {
    return <div className="h-[200px] bg-muted/40 rounded-lg flex items-center justify-center">Loading uploader...</div>
  }

  return (
    <div className="space-y-4">
      <div
        ref={dropZoneRef}
        className={`border-2 ${
          isDragging ? "border-primary bg-primary/5" : "border-dashed"
        } rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer`}
        onClick={handleBrowseClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
        <>
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
          <Button
            onClick={handleUpload}
            disabled={isLoading || files.length === 0}
            className="w-full mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Files to Database'
            )}
          </Button>
        </>
      )}
    </div>
  )
}

