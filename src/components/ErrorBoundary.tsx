import React from 'react';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
                        <AlertCircle className="h-8 w-8" />
                    </div>
                    <h2 className="text-xl font-bold">Bir şeyler yanlış gitti</h2>
                    <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                        Sayfa yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
                    </p>
                    <div className="pt-2">
                        <Button
                            onClick={() => window.location.reload()}
                            className="rounded-full gap-2"
                        >
                            <RefreshCw className="h-4 w-4" /> Sayfayı Yenile
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
