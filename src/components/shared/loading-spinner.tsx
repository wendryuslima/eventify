interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
  message = "Carregando...",
  size = "md",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto mb-4 ${sizeClasses[size]}`}
        ></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
