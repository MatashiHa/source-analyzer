'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Template {
    id: string;
    name: string;
    description: string;
    categories: string[];
    isDefault: boolean;
}

interface TemplateSelectProps {
  templates: Template[]
  onChange: (categories: string) => void
}

export function TemplateSelect({ templates, onChange }: TemplateSelectProps) {
  const searchParams = useSearchParams()
  const templateQuery = searchParams.get('template')
  const [selectedCats, setSelectedCats] = useState<string>("happiness");

  
  // Состояние с явной инициализацией
  const [selectedTemplateId, setSelectedTemplateId] = useState(() => {
    if (!templateQuery) return 'default'
    const exists = templates.some(t => String(t.id) === String(templateQuery))
    return exists ? String(templateQuery) : 'default'
  })
  
  const currentTemplate = templates.find(t => String(t.id) === String(selectedTemplateId));
  
  // Получаем имя для отображения
  const getDisplayName = () => {
    if (selectedTemplateId === 'default') return 'Default Template'
    return currentTemplate?.name || 'Selected Template'
  }
  // Обновляем категории при изменении шаблона
  useEffect(() => {
    if (!currentTemplate) return; // если шаблон не найден
    const newCategories = currentTemplate.id === "default" ? "happiness" : currentTemplate.categories?.join(",");
    setSelectedCats(newCategories);
  }, [currentTemplate]); // Зависимость от currentTemplate
  
  const handleChange = (id: string) => {
    setSelectedTemplateId(id); // selectedCats обновится автоматически благодаря useEffect
  };
  useEffect(() => {
    onChange(selectedCats)
  }, [selectedCats]);

  return (
    <Select value={selectedTemplateId} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue>
          {getDisplayName()}
        </SelectValue>
      </SelectTrigger>
      
      <SelectContent>
        <SelectItem value="default" disabled>Default Template</SelectItem>
        
        {templates.map(template => (
            <SelectItem key={template.id} value={String(template.id)}>
              {template.name}
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  )
}