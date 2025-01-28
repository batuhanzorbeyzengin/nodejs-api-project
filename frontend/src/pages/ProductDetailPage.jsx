import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProductById, checkProductEligibility } from "@/utils/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    staleTime: 1000 * 60 * 15, // 15 minute cache
  });

  const product = data?.data?.[0];

  const eligibilityMutation = useMutation({
    mutationFn: () => checkProductEligibility(id, {
      countryCode: "TR",
      currency: "TRY",
      price: product?.prices?.[0]?.price || 0
    }),
    onSuccess: (data) => {
      toast.success(data.eligible 
        ? "This product is eligible for sale" 
        : "This product is not eligible for sale"
      );
    },
    onError: (error) => {
      toast.error("An error occurred during eligibility check");
    }
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Loading...</div>
    </div>
  );

  if (!product) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-500">Product not found</div>
    </div>
  );

  const releaseDate = product.releaseDate 
    ? format(new Date(product.releaseDate), 'dd MMMM yyyy', { locale: enUS })
    : 'Not specified';

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Product List
        </Button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{product.genericName}</h1>
          <Badge variant="secondary" className="text-base">
            {product.platform}
          </Badge>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Publisher</h2>
                  <p className="text-muted-foreground">{product.publisher}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Release Date</h2>
                  <p className="text-muted-foreground">{releaseDate}</p>
                </div>

                {product.genres?.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Genres</h2>
                    <div className="flex flex-wrap gap-2">
                      {product.genres.map((genre) => (
                        <Badge key={genre} variant="outline">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {product.shortDescription?.["en-GB"] && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Description</h2>
                    <p className="text-muted-foreground">
                      {product.shortDescription["en-GB"]}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {product.prices?.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Prices</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {product.prices.map((price) => (
                    <div 
                      key={price.currency}
                      className="p-3 border rounded-lg text-center"
                    >
                      <div className="text-sm text-muted-foreground mb-1">
                        {price.currency}
                      </div>
                      <div className="font-semibold">
                        {price.priceFormatted}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center mt-4">
            <Button 
              size="lg"
              onClick={() => eligibilityMutation.mutate()}
              disabled={eligibilityMutation.isPending}
            >
              Check Sale Eligibility
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}