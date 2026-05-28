import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Listing } from "@/lib/data";
import { CheckCircle2, Flame, MessageCircle, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card 
      className={cn(
        "group relative flex flex-col overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl p-0 gap-0",
        listing.isBoosted 
          ? "border-boosted/40 bg-boosted/5 ring-4 ring-boosted/10" 
          : "border-transparent bg-card"
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted rounded-t-xl">
        {listing.imageUrl ? (
          <Image 
            src={listing.imageUrl} 
            alt={listing.title} 
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50 p-6 text-center">
            <Tag className="mb-2 h-8 w-8 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
              {listing.category}
            </span>
          </div>
        )}
        
        {listing.isBoosted && (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-boosted px-3 py-1 text-[10px] font-black uppercase tracking-wider text-boosted-foreground shadow-lg">
            <Flame className="h-3 w-3 fill-current" />
            Promocionado
          </div>
        )}
      </div>
      
      <CardHeader className="flex-1 p-5 pb-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="line-clamp-2 text-lg font-black leading-tight tracking-tight transition-colors group-hover:text-primary">
            {listing.title}
          </h3>
        </div>
      </CardHeader>
      
      <CardContent className="px-5 pb-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-2xl font-black text-primary">
            S/ {listing.price.toFixed(2)}
          </span>
          <Badge variant="secondary" className="rounded-lg bg-muted/50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            {listing.category}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 border-t pt-4">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
            {listing.sellerName.charAt(0)}
          </div>
          <div className="flex flex-1 items-center gap-1 overflow-hidden">
            <span className="truncate text-xs font-bold text-muted-foreground">{listing.sellerName}</span>
            {listing.isPro && (
              <Badge variant="secondary" className="h-5 gap-0.5 rounded-full bg-blue-600 px-1.5 text-[9px] font-black text-white hover:bg-blue-600 border-none">
                <CheckCircle2 className="h-2.5 w-2.5" />
                PRO
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Button 
          className="w-full gap-2 rounded-xl border-2 border-primary bg-primary py-6 text-sm font-black transition-all hover:bg-transparent hover:text-primary"
          onClick={() => alert(`Contactando a ${listing.sellerName} por ${listing.title}...`)}
        >
          <MessageCircle className="h-4 w-4" />
          Contactar ahora
        </Button>
      </CardFooter>
    </Card>
  );
}
