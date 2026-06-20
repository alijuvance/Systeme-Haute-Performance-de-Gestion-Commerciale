import { ArrowUpRight, Package, Users, DollarSign, Activity } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { title: "Chiffre d'affaires", value: "45,231 €", trend: "+20.1%", icon: DollarSign, color: "bg-green-500" },
    { title: "Nouveaux Clients", value: "+2350", trend: "+10.5%", icon: Users, color: "bg-blue-500" },
    { title: "Commandes", value: "+12,234", trend: "+19%", icon: Package, color: "bg-purple-500" },
    { title: "Activité", value: "573", trend: "+201 depuis 1h", icon: Activity, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">{stat.title}</h3>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} bg-opacity-10 dark:bg-opacity-20`}>
                  <Icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h2>
              </div>
              <p className="text-sm font-medium text-emerald-500 mt-2 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                {stat.trend}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-white/5 p-6 shadow-sm min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Évolution des Ventes</h3>
          <div className="flex-1 w-full flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-[#0f172a] rounded-xl border border-dashed border-gray-200 dark:border-white/10">
            [Graphique dynamique Chart.js à venir]
          </div>
        </div>
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-white/5 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Activité Récente</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg px-2 transition-colors cursor-pointer -mx-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {String.fromCharCode(64 + i)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Commande #{1000 + i}</p>
                  <p className="text-xs text-gray-500">Il y a {i * 10} min</p>
                </div>
                <span className="text-sm font-bold text-emerald-500">+{i * 150} €</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
