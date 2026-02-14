import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Card } from './Card';
import { Icons } from './Icons';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  footer?: ReactNode;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
};

/**
 * Modal responsive optimisé pour mobile et desktop
 */
export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '2xl',
  footer
}: ResponsiveModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <Card 
        className={clsx(
          'w-full rounded-t-2xl sm:rounded-2xl shadow-2xl',
          'max-h-[90vh] sm:max-h-[85vh]',
          'animate-in slide-in-from-bottom sm:zoom-in-95',
          'duration-200',
          maxWidthClasses[maxWidth]
        )}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-4 sm:px-6 py-4 border-b border-neutral-200 rounded-t-2xl sm:rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 truncate pr-4">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600"
              aria-label="Fermer"
            >
              <Icons.X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content avec scroll */}
        <div className="overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 max-h-[calc(90vh-8rem)] sm:max-h-[calc(85vh-10rem)]">
          {children}
        </div>

        {/* Footer (optionnel) */}
        {footer && (
          <div className="sticky bottom-0 bg-white z-10 px-4 sm:px-6 py-4 border-t border-neutral-200 rounded-b-2xl sm:rounded-b-xl">
            {footer}
          </div>
        )}
      </Card>
    </div>
  );
}
