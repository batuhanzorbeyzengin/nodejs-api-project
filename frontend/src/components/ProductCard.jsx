import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProductCard({ product, onClick }) {
  const { name, platform, publisher, prices } = product;

  const defaultPrice = prices.find(p => p.currency === 'USD') || prices[0];

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full"
      onClick={onClick}
    >
      <CardHeader className="flex-grow p-4 pb-2">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg line-clamp-2 min-h-[3.5rem]">
            {name}
          </CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {platform}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {publisher}
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-2 mt-auto">
        {defaultPrice ? (
          <div className="text-xl font-semibold text-primary">
            {defaultPrice.priceFormatted}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Price information not available
          </div>
        )}
      </CardContent>
    </Card>
  );
}