import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { TabItem } from '@/types';

interface TabsProps {
    tabs: TabItem[];
    defaultTab?: string;
    className?: string;
    onTabChange?: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({
    tabs,
    defaultTab,
    className,
    onTabChange,
}) => {
    const [activeTab, setActiveTab] = useState(
        defaultTab || tabs[0]?.id
    );

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        onTabChange?.(tabId);
    };

    const activeTabContent = tabs.find(
        (tab) => tab.id === activeTab
    )?.content;

    return (
        <div className={cn('w-full', className)}>
            {/* Tab Headers */}
            <div className="border-b border-secondary-200">
                <nav
                    className="-mb-px flex space-x-8"
                    aria-label="Tabs"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() =>
                                handleTabClick(tab.id)
                            }
                            className={cn(
                                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                                activeTab === tab.id
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                            )}
                        >
                            <div className="flex items-center space-x-2">
                                <span>{tab.label}</span>
                                {tab.badge && (
                                    <span
                                        className={cn(
                                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                            activeTab ===
                                                tab.id
                                                ? 'bg-primary-100 text-primary-800'
                                                : 'bg-secondary-100 text-secondary-800'
                                        )}
                                    >
                                        {tab.badge}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">{activeTabContent}</div>
        </div>
    );
};

interface TabPanelProps {
    children: React.ReactNode;
    className?: string;
}

const TabPanel: React.FC<TabPanelProps> = ({
    children,
    className,
}) => {
    return (
        <div
            className={cn('focus:outline-none', className)}
        >
            {children}
        </div>
    );
};

export { Tabs, TabPanel };
