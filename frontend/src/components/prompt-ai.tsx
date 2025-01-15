import React, { useState, useEffect } from "react";
import {
  Bot,
  Loader2,
  MessageSquarePlus,
  Play,
  Code,
  Wand2,
  Eraser,
  Sparkles,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getQueryFromLLMRequest } from "@/server/ai/promptQuery";

interface IAiPromptDialog {
  onGetSqlQueryFormat: (prompt: string) => void;
}

export function AiPromptDialog({ onGetSqlQueryFormat }: IAiPromptDialog) {
  const [prompt, setPrompt] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    console.log(prompt);
  };

  const handleClear = () => {
    setPrompt("");
  };

  const handleGetSqlFormat = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const sql = await getQueryFromLLMRequest(prompt.trim());
      onGetSqlQueryFormat(sql)
    } catch (error) {
      alert("An error occurred while generating SQL format.");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

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
          <DialogDescription>How can I help you today?</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleExecute} className="mt-4 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => {
                  const value = e.target.value;
                  setPrompt(value);
                }}
                placeholder="Enter your question or prompt here..."
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                style={{ minHeight: "120px" }}
              />

              <div className="absolute right-2 bottom-2 flex gap-2">
                {prompt && (
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Placeholder functions for API integration
async function executePrompt(prompt: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return "Sample response";
}
