import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, TrendingUp } from 'lucide-react';
import React from 'react';

type StatCardProps = {
  stat: string;
  value: string;
  description: string;
  icon: 'dollar' | 'package' | 'trending';
};

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  stat,
  value,
  description,
}) => {
  const iconToRender = () => {
    switch (icon) {
      case 'dollar':
        return <DollarSign className="h-4 w-4 text-muted-foreground" />;
      case 'package':
        return <Package className="h-4 w-4 text-muted-foreground" />;
      case 'trending':
        return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <Card className="text-left">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{stat}</CardTitle>
        {iconToRender()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};
