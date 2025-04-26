import { Card, CardContent } from "@/components/ui/card";

export default function QRCodeLoading() {
  return (
    <div className="w-full max-w-md mx-auto h-full">
      <Card className="w-full h-full">
        <CardContent className="pt-6 flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading payment details...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
