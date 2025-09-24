import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { HoverCard } from '@/components/animations';
import { formatNumber } from '@/utils/format';

interface StatsCardProps {
    value: number;
    label: string;
    color?: 'primary' | 'accent' | 'success' | 'warning';
}

const colorClasses = {
    primary: 'text-primary-600',
    accent: 'text-accent-600',
    success: 'text-success-600',
    warning: 'text-warning-600',
};

export const StatsCard: React.FC<StatsCardProps> = memo(
    ({ value, label, color = 'primary' }) => {
        return (
            <HoverCard>
                <Card className="text-center">
                    <CardContent className="pt-6">
                        <div
                            className={`text-3xl font-bold ${colorClasses[color]} mb-2`}
                        >
                            {formatNumber(value)}
                        </div>
                        <div className="text-secondary-600">
                            {label}
                        </div>
                    </CardContent>
                </Card>
            </HoverCard>
        );
    }
);

StatsCard.displayName = 'StatsCard';
