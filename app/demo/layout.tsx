export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      <header className="border-b bg-white shadow-sm py-4">
        <div className="container max-w-md mx-auto px-4 flex items-center justify-between">
          <div className="font-bold text-lg">Valest</div>
          <div className="text-sm text-muted-foreground">Demo Mode</div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        <div className="container max-w-md mx-auto px-4">
          &copy; {new Date().getFullYear()} Valest · Demo Environment
        </div>
      </footer>
    </div>
  );
}
