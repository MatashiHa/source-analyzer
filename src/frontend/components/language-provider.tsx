"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "ru"

type Translations = {
  [key: string]: {
    [key in Language]: string
  }
}

// Translation dictionary
const translations: Translations = {
  // Common
  "app.name": {
    en: "SourceAnalyzer",
    ru: "АнализаторИсточников",
  },
  "common.dashboard": {
    en: "Dashboard",
    ru: "Панель управления",
  },
  "common.newAnalysis": {
    en: "New Analysis",
    ru: "Новый анализ",
  },
  "common.sources": {
    en: "Sources",
    ru: "Источники",
  },
  "common.templates": {
    en: "Templates",
    ru: "Шаблоны",
  },
  "common.reports": {
    en: "Reports",
    ru: "Отчеты",
  },
  "common.monitoring": {
    en: "Monitoring",
    ru: "Мониторинг",
  },
  "common.save": {
    en: "Save",
    ru: "Сохранить",
  },
  "common.cancel": {
    en: "Cancel",
    ru: "Отмена",
  },
  "common.delete": {
    en: "Delete",
    ru: "Удалить",
  },
  "common.edit": {
    en: "Edit",
    ru: "Редактировать",
  },
  "common.view": {
    en: "View",
    ru: "Просмотр",
  },
  "common.create": {
    en: "Create",
    ru: "Создать",
  },
  "common.search": {
    en: "Search",
    ru: "Поиск",
  },
  "common.filter": {
    en: "Filter",
    ru: "Фильтр",
  },
  "common.active": {
    en: "Active",
    ru: "Активный",
  },
  "common.paused": {
    en: "Paused",
    ru: "Приостановлено",
  },
  "common.error": {
    en: "Error",
    ru: "Ошибка",
  },
  "common.all": {
    en: "All",
    ru: "Все",
  },
  "common.back": {
    en: "Back",
    ru: "Назад",
  },
  "common.next": {
    en: "Next",
    ru: "Далее",
  },
  "common.run": {
    en: "Run",
    ru: "Запустить",
  },
  "common.pause": {
    en: "Pause",
    ru: "Приостановить",
  },
  "common.resume": {
    en: "Resume",
    ru: "Возобновить",
  },
  "common.details": {
    en: "Details",
    ru: "Детали",
  },
  "common.settings": {
    en: "Settings",
    ru: "Настройки",
  },
  "common.alerts": {
    en: "Alerts",
    ru: "Оповещения",
  },
  "common.history": {
    en: "History",
    ru: "История",
  },
  "common.overview": {
    en: "Overview",
    ru: "Обзор",
  },
  "common.frequency": {
    en: "Frequency",
    ru: "Частота",
  },
  "common.keywords": {
    en: "Keywords",
    ru: "Ключевые слова",
  },
  "common.description": {
    en: "Description",
    ru: "Описание",
  },
  "common.name": {
    en: "Name",
    ru: "Название",
  },
  "common.type": {
    en: "Type",
    ru: "Тип",
  },
  "common.status": {
    en: "Status",
    ru: "Статус",
  },
  "common.date": {
    en: "Date",
    ru: "Дата",
  },
  "common.actions": {
    en: "Actions",
    ru: "Действия",
  },
  "common.sources": {
    en: "Sources",
    ru: "Источники",
  },
  "common.new": {
    en: "New",
    ru: "Новый",
  },
  "common.generate": {
    en: "Generate",
    ru: "Сгенерировать",
  },
  "common.report": {
    en: "Report",
    ru: "Отчет",
  },
  "common.schedule": {
    en: "Schedule",
    ru: "Расписание",
  },
  "common.daily": {
    en: "Daily",
    ru: "Ежедневно",
  },
  "common.weekly": {
    en: "Weekly",
    ru: "Еженедельно",
  },
  "common.monthly": {
    en: "Monthly",
    ru: "Ежемесячно",
  },
  "common.hourly": {
    en: "Hourly",
    ru: "Ежечасно",
  },
  "common.language": {
    en: "Language",
    ru: "Язык",
  },
  "common.theme": {
    en: "Theme",
    ru: "Тема",
  },
  "common.light": {
    en: "Light",
    ru: "Светлая",
  },
  "common.dark": {
    en: "Dark",
    ru: "Темная",
  },
  "common.system": {
    en: "System",
    ru: "Системная",
  },

  // Dashboard
  "dashboard.title": {
    en: "Source Analysis Dashboard",
    ru: "Панель анализа источников",
  },
  "dashboard.activeAnalyses": {
    en: "Active Analyses",
    ru: "Активные анализы",
  },
  "dashboard.processedSources": {
    en: "Processed Sources",
    ru: "Обработанные источники",
  },
  "dashboard.classificationTemplates": {
    en: "Classification Templates",
    ru: "Шаблоны классификации",
  },
  "dashboard.recentAnalyses": {
    en: "Recent Analyses",
    ru: "Недавние анализы",
  },
  "dashboard.quickActions": {
    en: "Quick Actions",
    ru: "Быстрые действия",
  },
  "dashboard.newAnalysis": {
    en: "New Analysis",
    ru: "Новый анализ",
  },
  "dashboard.scheduleMonitoring": {
    en: "Schedule Monitoring",
    ru: "Запланировать мониторинг",
  },
  "dashboard.createTemplate": {
    en: "Create Template",
    ru: "Создать шаблон",
  },
  "dashboard.generateReport": {
    en: "Generate Report",
    ru: "Сгенерировать отчет",
  },

  // Monitoring
  "monitoring.title": {
    en: "Schedule Monitoring",
    ru: "Мониторинг по расписанию",
  },
  "monitoring.subtitle": {
    en: "Set up and manage automated source monitoring schedules",
    ru: "Настройка и управление автоматическим мониторингом источников",
  },
  "monitoring.createSchedule": {
    en: "Create Schedule",
    ru: "Создать расписание",
  },
  "monitoring.allSchedules": {
    en: "All Schedules",
    ru: "Все расписания",
  },
  "monitoring.activeSchedules": {
    en: "Active",
    ru: "Активные",
  },
  "monitoring.pausedSchedules": {
    en: "Paused",
    ru: "Приостановленные",
  },
  "monitoring.errorSchedules": {
    en: "Error",
    ru: "С ошибками",
  },
  "monitoring.runAllActive": {
    en: "Run All Active",
    ru: "Запустить все активные",
  },
  "monitoring.newSchedule": {
    en: "New Schedule",
    ru: "Новое расписание",
  },
  "monitoring.viewAllAlerts": {
    en: "View All Alerts",
    ru: "Просмотреть все оповещения",
  },
  "monitoring.generateReport": {
    en: "Generate Report",
    ru: "Сгенерировать отчет",
  },
  "monitoring.noSchedulesFound": {
    en: "No monitoring schedules found",
    ru: "Расписания мониторинга не найдены",
  },
  "monitoring.noSchedulesMatch": {
    en: "No schedules match your search criteria",
    ru: "Нет расписаний, соответствующих критериям поиска",
  },
  "monitoring.noSchedulesYet": {
    en: "You haven't created any monitoring schedules yet",
    ru: "Вы еще не создали расписания мониторинга",
  },
  "monitoring.createFirstSchedule": {
    en: "Create Your First Schedule",
    ru: "Создать первое расписание",
  },
  "monitoring.nextRun": {
    en: "Next Run",
    ru: "Следующий запуск",
  },
  "monitoring.totalSources": {
    en: "Total Sources",
    ru: "Всего источников",
  },
  "monitoring.alertsDetected": {
    en: "alerts detected",
    ru: "обнаружено оповещений",
  },
  "monitoring.alertDetected": {
    en: "alert detected",
    ru: "обнаружено оповещение",
  },
  "monitoring.viewDetails": {
    en: "View Details",
    ru: "Просмотреть детали",
  },
  "monitoring.fixError": {
    en: "Fix Error",
    ru: "Исправить ошибку",
  },
  "monitoring.deleteSchedule": {
    en: "Delete Monitoring Schedule",
    ru: "Удалить расписание мониторинга",
  },
  "monitoring.deleteConfirm": {
    en: "Are you sure you want to delete this monitoring schedule? This action cannot be undone.",
    ru: "Вы уверены, что хотите удалить это расписание мониторинга? Это действие нельзя отменить.",
  },
  "monitoring.deleteWarning": {
    en: "Deleting this schedule will stop all future monitoring runs. Historical data from previous runs will remain available.",
    ru: "Удаление этого расписания остановит все будущие запуски мониторинга. Исторические данные от предыдущих запусков останутся доступными.",
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ru")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language]
    }
    // Fallback to English if translation is missing
    if (translations[key] && translations[key]["en"]) {
      return translations[key]["en"]
    }
    // Return the key if no translation is found
    return key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

