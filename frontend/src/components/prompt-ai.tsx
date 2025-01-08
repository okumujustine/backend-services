import React, { useState, useEffect } from 'react'
import { Bot, Loader2, MessageSquarePlus, Play, Code, Wand2, Eraser, Sparkles, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface CachedQuery {
    prompt: string
    response: string
    sqlFormat?: string
    timestamp: number
  }
  
  export function AiPromptDialog() {
    const [prompt, setPrompt] = useState('')
    const [response, setResponse] = useState('')
    const [sqlFormat, setSqlFormat] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [showPrevious, setShowPrevious] = useState(false)
  
    useEffect(() => {
      if (isOpen) {
        setShowPrevious(Boolean(localStorage.getItem('lastQuery')))
      } else {
        setShowPrevious(false)
      }
    }, [isOpen])
  
    const loadPreviousQuery = () => {
      const cachedQuery = localStorage.getItem('lastQuery')
      if (cachedQuery) {
        const { prompt: cachedPrompt, response: cachedResponse, sqlFormat: cachedSqlFormat } = JSON.parse(cachedQuery) as CachedQuery
        setPrompt(cachedPrompt)
        setResponse(cachedResponse)
        setSqlFormat(cachedSqlFormat || '')
      }
    }
  
    const cacheQuery = (newPrompt: string, newResponse: string, newSqlFormat?: string) => {
      const queryData: CachedQuery = {
        prompt: newPrompt,
        response: newResponse,
        sqlFormat: newSqlFormat || sqlFormat,
        timestamp: Date.now()
      }
      localStorage.setItem('lastQuery', JSON.stringify(queryData))
    }
  
    const handleExecute = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!prompt.trim()) return
  
      setIsLoading(true)
      try {
        const response = await executePrompt(prompt)
        setResponse(response)
        cacheQuery(prompt, response)
        setIsOpen(false)
      } catch (error) {
        setResponse('An error occurred while processing your request.')
      } finally {
        setIsLoading(false)
      }
    }
  
    const handleGetSqlFormat = async () => {
      if (!prompt.trim()) return
  
      setIsLoading(true)
      try {
        const sql = await getSqlFormat(prompt)
        setSqlFormat(sql)
        cacheQuery(prompt, response, sql)
      } catch (error) {
        setSqlFormat('An error occurred while generating SQL format.')
      } finally {
        setIsLoading(false)
      }
    }
  
    const handleImprove = () => {
      if (!response) return
      const improvementPrompt = `Improve this result: ${response}`
      setPrompt(improvementPrompt)
    }
  
    const handleClear = () => {
      setPrompt('')
      setResponse('')
      setSqlFormat('')
      localStorage.removeItem('lastQuery')
      setShowPrevious(false)
    }
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            Ask AI
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Assistant
            </DialogTitle>
            <DialogDescription>
              How can I help you today?
            </DialogDescription>
          </DialogHeader>
  
          <form onSubmit={handleExecute} className="mt-4 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your question or prompt here..."
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  style={{ minHeight: '120px' }}
                />
                
                <div className="absolute right-2 bottom-2 flex gap-2">
                  {showPrevious && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={loadPreviousQuery}
                      className="text-xs"
                    >
                      <History className="h-3 w-3 mr-1" />
                      Previous
                    </Button>
                  )}
                  {(prompt || response || sqlFormat) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="text-xs text-destructive hover:text-destructive"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
  
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGetSqlFormat}
                  disabled={isLoading || !prompt.trim()}
                  className="text-xs"
                >
                  <Code className="h-3 w-3 mr-1" />
                  SQL Format
                </Button>
                
                {response && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleImprove}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    <Wand2 className="h-3 w-3 mr-1" />
                    Improve
                  </Button>
                )}
                
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || !prompt.trim()}
                  className="text-xs"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      Execute
                    </>
                  )}
                </Button>
              </div>
  
              {(response || sqlFormat) && (
                <div className="space-y-4 mt-6">
                  {response && (
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm leading-relaxed">{response}</p>
                    </div>
                  )}
                  
                  {sqlFormat && (
                    <div className="rounded-lg bg-muted/50 p-4">
                      <pre className="text-xs overflow-x-auto p-3 bg-background rounded-md border">
                        {sqlFormat}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
  
  // Placeholder functions for API integration
  async function executePrompt(prompt: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return 'Sample response'
  }
  
  async function getSqlFormat(prompt: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return 'SELECT * FROM table WHERE condition = true;'
  }