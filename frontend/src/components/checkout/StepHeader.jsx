export function StepHeader({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h2 className="text-black font-bold uppercase tracking-tight">{title}</h2>
        <p className="text-xs text-zinc-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}
