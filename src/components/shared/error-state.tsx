import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const ErrorState = ({
  title = "Erro",
  message,
  onRetry,
  showBackButton = false,
  onBack,
}: ErrorStateProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="space-x-4">
          {showBackButton && onBack && (
            <Button onClick={onBack} variant="outline">
              Voltar
            </Button>
          )}
          {onRetry && <Button onClick={onRetry}>Tentar novamente</Button>}
        </div>
      </div>
    </div>
  );
};


