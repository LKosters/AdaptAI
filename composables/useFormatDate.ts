export const useFormatDate = () => {
  const formatDate = (
    dateInput: string | Date | null | undefined,
    format: 'short' | 'medium' | 'long' | 'full' | 'relative' | 'time' | 'date' | 'datetime' = 'medium',
    locale: string = 'en-US'
  ): string => {
    if (!dateInput) return ''
    
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }
    
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    switch (format) {
      case 'relative':
        return getRelativeTime(diffInMs, diffInDays, locale)
      
      case 'time':
        return new Intl.DateTimeFormat(locale, {
          hour: '2-digit',
          minute: '2-digit'
        }).format(date)
      
      case 'date':
        return new Intl.DateTimeFormat(locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(date)
      
      case 'datetime':
        return new Intl.DateTimeFormat(locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date)
      
      case 'short':
        return new Intl.DateTimeFormat(locale, {
          dateStyle: 'short'
        }).format(date)
      
      case 'medium':
        return new Intl.DateTimeFormat(locale, {
          dateStyle: 'medium'
        }).format(date)
      
      case 'long':
        return new Intl.DateTimeFormat(locale, {
          dateStyle: 'long'
        }).format(date)
      
      case 'full':
        return new Intl.DateTimeFormat(locale, {
          dateStyle: 'full'
        }).format(date)
      
      default:
        return new Intl.DateTimeFormat(locale, {
          dateStyle: 'medium'
        }).format(date)
    }
  }
  
  const getRelativeTime = (diffInMs: number, diffInDays: number, locale: string): string => {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
    
    if (Math.abs(diffInDays) < 1) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
      if (Math.abs(diffInHours) < 1) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        return rtf.format(-diffInMinutes, 'minute')
      }
      return rtf.format(-diffInHours, 'hour')
    }
    
    if (Math.abs(diffInDays) < 30) {
      return rtf.format(-diffInDays, 'day')
    }
    
    const diffInMonths = Math.floor(diffInDays / 30)
    if (Math.abs(diffInMonths) < 12) {
      return rtf.format(-diffInMonths, 'month')
    }
    
    const diffInYears = Math.floor(diffInDays / 365)
    return rtf.format(-diffInYears, 'year')
  }
  
  const isToday = (dateInput: string | Date): boolean => {
    if (!dateInput) return false
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }
  
  const isYesterday = (dateInput: string | Date): boolean => {
    if (!dateInput) return false
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return date.toDateString() === yesterday.toDateString()
  }
  
  const formatDateRange = (
    startDate: string | Date,
    endDate: string | Date,
    format: 'short' | 'medium' | 'long' = 'medium',
    locale: string = 'en-US'
  ): string => {
    if (!startDate || !endDate) return ''
    
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Invalid Date Range'
    }
    
    const formattedStart = formatDate(start, format, locale)
    const formattedEnd = formatDate(end, format, locale)
    
    return `${formattedStart} - ${formattedEnd}`
  }
  
  return {
    formatDate,
    isToday,
    isYesterday,
    formatDateRange
  }
} 