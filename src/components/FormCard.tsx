import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface FormCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormCard({ title, description, children, className = '' }: FormCardProps) {
  return (
    <Card className={`border-gray-200 ${className}`}>
      {(title || description) && (
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {description && (
            <CardDescription className="text-sm">{description}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}
