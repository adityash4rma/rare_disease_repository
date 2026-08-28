import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-6 font-sans">
          <div className="bg-white rounded-3xl p-10 max-w-lg w-full border border-slate-100 shadow-xl text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-500 mb-6">
              The application encountered an unexpected issue while rendering this view.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
              >
                <RefreshCw size={16} /> Reload Page
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
