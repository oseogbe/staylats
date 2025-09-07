import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  bgColor?: string;
  iconColor?: string;
}

export function MetricCard({ icon, title, value, subtitle, bgColor = "bg-blue-100", iconColor = "text-blue-600" }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 ${bgColor} rounded-lg`}>
            <div className={`w-5 h-5 ${iconColor}`}>
              {icon}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600">{title}</p>
            <p className="text-2xl font-bold text-neutral-900">{value}</p>
            <p className="text-xs text-neutral-500">{subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
