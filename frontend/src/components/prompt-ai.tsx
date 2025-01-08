import React, { useState, useEffect } from 'react'
import { Bot, Loader2, MessageSquarePlus, Play, Code, Wand2, Eraser, Sparkles } from 'lucide-react'
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

  useEffect(() => {
    const cachedQuery = localStorage.getItem('lastQuery')
    if (cachedQuery) {
      const { prompt: cachedPrompt, response: cachedResponse, sqlFormat: cachedSqlFormat } = JSON.parse(cachedQuery) as CachedQuery
      setPrompt(cachedPrompt)
      setResponse(cachedResponse)
      setSqlFormat(cachedSqlFormat || '')
    }
  }, [])

  const cacheQuery = (newPrompt: string, newResponse: string, newSqlFormat?: string) => {
    const queryData: CachedQuery = {
      prompt: newPrompt,
      response: newResponse,
      sqlFormat: newSqlFormat || sqlFormat, // Preserve existing SQL format if not provided
      timestamp: Date.now()
    }
    localStorage.setItem('lastQuery', JSON.stringify(queryData))
  }

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    
    try {
      // TODO: Replace with actual API call
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
      // TODO: Replace with actual SQL format API call
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
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Ask AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Ask AI Assistant
          </DialogTitle>
          <DialogDescription>
            Enter your prompt below and I'll help you find the query.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleExecute} className="space-y-4">
          <div className="grid gap-4">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What would you like to get a query for?"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-y-auto"
                style={{ maxHeight: '200px', minHeight: '120px' }}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={handleClear}
                className="gap-2 w-full sm:w-auto"
                disabled={!prompt.trim() && !response && !sqlFormat}
              >
                <Eraser className="h-4 w-4" />
                Clear All
              </Button>

              <div className="flex flex-col sm:flex-row gap-2">
                {response && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleImprove}
                    disabled={isLoading}
                    className="w-full sm:w-auto whitespace-nowrap"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Improve Result
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGetSqlFormat}
                  disabled={isLoading || !prompt.trim()}
                  className="w-full sm:w-auto whitespace-nowrap"
                >
                  <Code className="mr-2 h-4 w-4" />
                  Get SQL Format
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="w-full sm:w-auto whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Execute
                    </>
                  )}
                </Button>
              </div>
            </div>

            {(response || sqlFormat) && (
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {response && (
                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm whitespace-pre-wrap">{response}</p>
                  </div>
                )}
                
                {sqlFormat && (
                  <div className="rounded-md bg-muted p-4">
                    <pre className="text-sm overflow-x-auto p-2 bg-background rounded border">
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
  // TODO: Implement actual API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  return 'Sample response'
}

async function getSqlFormat(prompt: string): Promise<string> {
  // TODO: Implement actual SQL format API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  return 'SELECT * FROM table WHERE condition = true;'
}