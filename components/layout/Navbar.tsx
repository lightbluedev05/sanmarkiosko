import { Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container flex h-14 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-primary">
            Sanmarkiosko
          </span>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="relative w-full max-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="h-9 w-full rounded-full bg-muted pl-8 md:hidden"
            />
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
