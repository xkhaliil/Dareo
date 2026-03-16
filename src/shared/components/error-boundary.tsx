import { Component, type ErrorInfo, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex items-center justify-center p-8">
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm max-w-md w-full">
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <AlertCircle className="size-10 text-destructive/60" />
              <div>
                <p className="font-semibold mb-1">Something went wrong</p>
                <p className="text-sm text-muted-foreground">
                  {this.state.error?.message || "An unexpected error occurred."}
                </p>
              </div>
              <Button
                variant="outline"
                className="gap-2 cursor-pointer"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                <RefreshCw className="size-4" /> Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
