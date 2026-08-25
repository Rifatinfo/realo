import type { LucideIcon } from "lucide-react";

/**
 * Landing card for a Programs route that has a sidebar entry but no feature
 * behind it yet. Keeps the link from 404-ing and states plainly that the
 * screen is still to be built.
 */
export function ProgramPlaceholder({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Icon className="size-5" />
          </span>

          <div>
            <h1 className="text-[18px] font-semibold text-slate-900">{title}</h1>
            <p className="mt-1 max-w-prose text-[13px] text-slate-500">{description}</p>
            <p className="mt-4 inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[12px] font-medium text-amber-700">
              Not built yet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
