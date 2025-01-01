import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
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
import { useGitBranches } from "@/hooks/useGitBranches"

interface BranchSelectorProps {
  gitUrl: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function BranchSelector({ 
  gitUrl, 
  placeholder = "Select Branch",
  value: externalValue,
  onValueChange
}: BranchSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(externalValue || "")
  const { branches, isLoading, error } = useGitBranches(gitUrl);

  // Sync with external value
  React.useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue);
    }
  }, [externalValue]);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={isLoading}
        >
          <span className="truncate">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : value ? (
              branches.find((item) => item.value === value)?.label || value
            ) : (
              placeholder
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>
              {error ? `Error: ${error}` : "No branches found."}
            </CommandEmpty>
            <CommandGroup>
              {branches.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={handleSelect}
                  className="flex items-center"
                >
                  <span className="flex-1 truncate">{item.label}</span>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4 flex-shrink-0",
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