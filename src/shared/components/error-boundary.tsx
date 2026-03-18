import { Component, type ErrorInfo, type ReactNode } from "react";

import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

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
          <Card className="bg-card/50 border-border/50 w-full max-w-md backdrop-blur-sm">
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <AlertCircle className="text-destructive/60 size-10" />
              <div>
                <p className="mb-1 font-semibold">Something went wrong</p>
                <p className="text-muted-foreground text-sm">
                  {this.state.error?.message || "An unexpected error occurred."}
                </p>
              </div>
              <Button
                variant="outline"
                className="cursor-pointer gap-2"
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
