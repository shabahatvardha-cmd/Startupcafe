import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-bg text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="glass-card max-w-md w-full p-8 rounded-2xl border border-white/10 shadow-2xl space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl font-bold">
              !
            </div>
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
            <p className="text-sm text-slate-400">
              The page encountered a temporary display issue. You can refresh or return to the main website safely.
            </p>
            {this.state.error?.message && (
              <div className="p-3 rounded-lg bg-black/50 border border-white/5 text-xs text-rose-300 font-mono text-left overflow-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 font-semibold text-sm transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
