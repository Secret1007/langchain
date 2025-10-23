import React, { createContext, useContext, useState, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface TabsContextType {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ defaultValue = "", value, onValueChange, children, className, ...props }) => {
    const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

    const currentValue = value !== undefined ? value : selectedValue;

    const handleValueChange = (newValue: string): void => {
        if (value === undefined) {
            setSelectedValue(newValue);
        }
        onValueChange?.(newValue);
    };

    return (
        <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
            <div className={cn("w-full", className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

const TabsList: React.FC<TabsListProps> = ({ children, className, ...props }) => {
    return (
        <div
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    children: ReactNode;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className, ...props }) => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('TabsTrigger must be used within a Tabs component');
    }
    const { value: selectedValue, onValueChange } = context;

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                selectedValue === value
                    ? "bg-background text-foreground shadow-sm"
                    : "hover:bg-background/50",
                className
            )}
            onClick={() => onValueChange(value)}
            {...props}
        >
            {children}
        </button>
    );
};

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    children: ReactNode;
}

const TabsContent: React.FC<TabsContentProps> = ({ value, children, className, ...props }) => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('TabsContent must be used within a Tabs component');
    }
    const { value: selectedValue } = context;

    if (selectedValue !== value) {
        return null;
    }

    return (
        <div
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };

