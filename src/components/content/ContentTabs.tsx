import React, { memo } from 'react';
import { Button } from '@/components/ui/Button';
import { MessageSquare, BookOpen, Cpu } from 'lucide-react';

interface TabItem {
    id: 'reviews' | 'recipes' | 'models';
    label: string;
    icon: React.ComponentType<any>;
}

interface ContentTabsProps {
    activeTab: 'reviews' | 'recipes' | 'models';
    onTabChange: (
        tab: 'reviews' | 'recipes' | 'models'
    ) => void;
}

const tabs: TabItem[] = [
    {
        id: 'reviews',
        label: '최신 리뷰',
        icon: MessageSquare,
    },
    { id: 'recipes', label: '인기 레시피', icon: BookOpen },
    { id: 'models', label: '추천 모델', icon: Cpu },
];

export const ContentTabs: React.FC<ContentTabsProps> = memo(
    ({ activeTab, onTabChange }) => {
        return (
            <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map((tab) => (
                    <Button
                        key={tab.id}
                        variant={
                            activeTab === tab.id
                                ? 'primary'
                                : 'ghost'
                        }
                        onClick={() => onTabChange(tab.id)}
                        className="flex items-center space-x-2"
                    >
                        <tab.icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                    </Button>
                ))}
            </div>
        );
    }
);

ContentTabs.displayName = 'ContentTabs';
