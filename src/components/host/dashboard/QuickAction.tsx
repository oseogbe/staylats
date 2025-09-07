import { Button } from "@/components/ui/button";

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export function QuickAction({ icon, label, onClick, bgColor, textColor, borderColor }: QuickActionProps) {
  return (
    <Button 
      onClick={onClick}
      className={`h-16 ${bgColor} hover:bg-opacity-80 ${textColor} ${borderColor} flex flex-col items-center justify-center space-y-1`}
      variant="outline"
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="text-sm">{label}</span>
    </Button>
  );
}
