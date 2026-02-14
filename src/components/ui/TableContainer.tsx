import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface TableContainerProps {
  children: ReactNode;
  className?: string;
  minWidth?: string;
}

/**
 * Container responsive pour les tableaux
 * Ajoute le scroll horizontal avec indicateurs visuels sur mobile
 */
export function TableContainer({ 
  children, 
  className,
  minWidth = '800px' 
}: TableContainerProps) {
  return (
    <div className={clsx('relative', className)}>
      {/* Indicateur de scroll à gauche */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 md:hidden" />
      
      {/* Indicateur de scroll à droite */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 md:hidden" />
      
      {/* Container avec scroll */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div style={{ minWidth }} className="inline-block min-w-full">
          {children}
        </div>
      </div>
      
      {/* Message d'aide mobile */}
      <div className="mt-2 text-xs text-neutral-500 text-center md:hidden">
        ← Faites défiler horizontalement pour voir plus →
      </div>
    </div>
  );
}

/**
 * Table responsive avec styles par défaut
 */
export function ResponsiveTable({ 
  children, 
  className,
  minWidth 
}: TableContainerProps) {
  return (
    <TableContainer minWidth={minWidth}>
      <table className={clsx('w-full', className)}>
        {children}
      </table>
    </TableContainer>
  );
}
