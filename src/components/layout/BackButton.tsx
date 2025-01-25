import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  to: string;
  label: string;
  className?: string;
}

export function BackButton({ to, label, className }: BackButtonProps) {
  return (
    <Link 
      to={to}
      className={cn(
        "inline-flex items-center text-gray-600 hover:text-gray-900",
        className
      )}
    >
      <ArrowLeft className="h-5 w-5 mr-2" />
      {label}
    </Link>
  );
}