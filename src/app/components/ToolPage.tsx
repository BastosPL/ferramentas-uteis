import { WebAppSchema, BreadcrumbSchema } from "./SchemaOrg";

type AccentColor = "blue" | "green" | "purple" | "orange" | "red" | "teal" | "pink" | "indigo" | "amber" | "emerald" | "cyan" | "rose" | "violet" | "sky";

const accentStyles: Record<AccentColor, { header: string; badge: string }> = {
  blue: { header: "from-blue-600 to-blue-700", badge: "bg-blue-100 text-blue-700" },
  green: { header: "from-green-600 to-green-700", badge: "bg-green-100 text-green-700" },
  purple: { header: "from-purple-600 to-purple-700", badge: "bg-purple-100 text-purple-700" },
  orange: { header: "from-orange-500 to-orange-600", badge: "bg-orange-100 text-orange-700" },
  red: { header: "from-red-600 to-red-700", badge: "bg-red-100 text-red-700" },
  teal: { header: "from-teal-600 to-teal-700", badge: "bg-teal-100 text-teal-700" },
  pink: { header: "from-pink-600 to-pink-700", badge: "bg-pink-100 text-pink-700" },
  indigo: { header: "from-indigo-600 to-indigo-700", badge: "bg-indigo-100 text-indigo-700" },
  amber: { header: "from-amber-500 to-amber-600", badge: "bg-amber-100 text-amber-700" },
  emerald: { header: "from-emerald-600 to-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
  cyan: { header: "from-cyan-600 to-cyan-700", badge: "bg-cyan-100 text-cyan-700" },
  rose: { header: "from-rose-600 to-rose-700", badge: "bg-rose-100 text-rose-700" },
  violet: { header: "from-violet-600 to-violet-700", badge: "bg-violet-100 text-violet-700" },
  sky: { header: "from-sky-600 to-sky-700", badge: "bg-sky-100 text-sky-700" },
};

export default function ToolPage({
  title,
  description,
  accent = "blue",
  icon,
  slug,
  children,
}: {
  title: string;
  description: string;
  accent?: AccentColor;
  icon: string;
  slug?: string;
  children: React.ReactNode;
}) {
  const style = accentStyles[accent];
  const url = slug ? `/${slug}` : "";
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <WebAppSchema name={title} description={description} url={url} />
      <BreadcrumbSchema items={[
        { name: "Inicio", url: "/" },
        { name: title, url: url },
      ]} />
      <div className={`bg-gradient-to-r ${style.header} rounded-2xl p-6 mb-8 text-white`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{icon}</span>
          <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        </div>
        <p className="text-white/90 text-sm md:text-base">{description}</p>
      </div>
      {children}
    </div>
  );
}
