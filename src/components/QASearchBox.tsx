import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DEFAULT_BOXES, Box } from "@/data/defaultBoxes"

interface SearchBoxProps {
  value: string;
  onChange: (query: string) => void;
}

export function QASearchBox({ value, onChange }: SearchBoxProps) {
  const [open, setOpen] = React.useState(false)
  const [boxes, setBoxes] = React.useState<Box[]>(DEFAULT_BOXES)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchBoxes = async () => {
      try {
        setLoading(true)
        // Replace with your actual API endpoint
        const username = import.meta.env.VITE_USERNAME;
        const apiToken = import.meta.env.VITE_API_TOKEN;
        const url = import.meta.env.VITE_JENKINS_URL;

        console.log("about to fetch")
        const response = await window.electron.invoke('fetch-data',{url,username, apiToken});
        console.log("finished fetch")

        if (!response.ok) throw new Error('Failed to fetch boxes')

        setBoxes(response.data);
      } catch (err) {
        console.log(err)
        setError(err instanceof Error ? err.message : 'Failed to load boxes')
      } finally {
        setLoading(false)
      }
    }

    fetchBoxes()
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={loading}
        >
          {loading ? (
            "Loading..."
          ) : value ? (
            boxes.find((item) => item.value === value)?.label
          ) : (
            "Select QA Box"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search QA Box..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              {error ? `Error: ${error}` : "No boxes found."}
            </CommandEmpty>
            <CommandGroup>
              {boxes.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}