import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CATEGORIES, Category } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface CategoryPillsProps {
  selectedCategories: Category[];
  onToggle: (category: Category) => void;
}

export function CategoryPills({ selectedCategories, onToggle }: CategoryPillsProps) {
  return (
    <div className="relative group -mx-2 px-2">
      <ScrollArea className="w-full whitespace-nowrap overflow-visible">
        <div className="flex w-max space-x-3 pb-3 pt-2 px-2 pr-16 overflow-visible">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <Badge
                key={category}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer rounded-2xl px-6 py-2.5 text-sm font-black transition-all shadow-sm hover:scale-105 active:scale-95 border-2",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white hover:border-primary hover:text-primary"
                )}
                onClick={() => onToggle(category)}
              >
                {category}
              </Badge>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
      
      {/* Visual indicator for horizontal scroll */}
      <div className="absolute right-0 top-1 bottom-3 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none flex items-center justify-end pr-2">
        <div className="h-8 w-8 rounded-full bg-white/90 shadow-lg border-2 flex items-center justify-center text-primary animate-pulse">
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
