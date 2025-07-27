'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { countryCodes } from '@/data/country'; // <-- Import your file

interface NumberSelectionProps {
  defaultValue?: string; // ✅ Allow passing initial value
  onSelect?: (value: string) => void; // ✅ Notify parent on selection
}

export function NumberSelection({
  defaultValue = '+63', // ✅ Default to PH
  onSelect,
}: NumberSelectionProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const handleSelect = (selectedValue: string) => {
    setValue(selectedValue);
    setOpen(false);
    if (onSelect) onSelect(selectedValue); // ✅ Notify parent
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[80px] justify-between border-2" // ✅ Fixed width for consistency
        >
          {value}
          <ChevronDown className=" size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        {' '}
        {/* ✅ Wider list for full labels */}
        <Command>
          <CommandInput className="h-9" placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No Country found.</CommandEmpty>
            <CommandGroup>
              {countryCodes.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={() => handleSelect(item.value)}
                >
                  {item.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
