export default function Footer() {
  const adminUrl =
    import.meta.env.VITE_ADMIN_URL ||
    (window.location.hostname === 'localhost'
      ? 'http://localhost:5174/sc-portal/access'
      : 'https://admin.startupcafe.co.in/sc-portal/access');

  return (
    <footer className="w-full py-8 border-t border-white/10 bg-black/50 backdrop-blur-md relative z-10 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="tracking-wide">
          &copy; {new Date().getFullYear()} Startup Cafe. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a
            href={adminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-neon-blue transition-colors flex items-center gap-1.5 group"
          >
            <span>Staff &amp; Admin Portal</span>
            <span className="text-[11px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              ↗
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
