import React, { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageContainerProps {
  title?: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
}

export function PageContainer({
  title,
  description,
  breadcrumbs,
  actions,
  children,
  maxWidth = '6xl',
}: PageContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full',
  };

  return (
    <div className="bg-gray-50">
      <div className={`mx-auto ${maxWidthClasses[maxWidth]} px-6 py-8`}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                  )}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Page Header */}
        {(title || description || actions) && (
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {title && (
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-gray-600 max-w-3xl">
                    {description}
                  </p>
                )}
              </div>
              {actions && (
                <div className="ml-6 flex-shrink-0">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
