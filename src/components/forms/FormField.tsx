import { useId } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: any;
  onChange: (value: any) => void;
  error?: string[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  'aria-describedby'?: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className,
  description,
  'aria-describedby': ariaDescribedby,
}: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  const describedBy = [
    ariaDescribedby,
    description ? descriptionId : null,
    error?.length ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={id}
        className={cn(
          'block text-sm font-medium text-gray-700',
          error?.length && 'text-red-600',
          disabled && 'opacity-50'
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {description && (
        <p
          id={descriptionId}
          className="text-sm text-gray-500"
        >
          {description}
        </p>
      )}

      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          aria-invalid={error?.length > 0}
          aria-describedby={describedBy}
          className={cn(
            'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
            error?.length && 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500',
            disabled && 'bg-gray-50 text-gray-500'
          )}
        />
      </div>

      {error?.length > 0 && (
        <p
          id={errorId}
          className="mt-2 text-sm text-red-600"
          role="alert"
        >
          {error.join('. ')}
        </p>
      )}
    </div>
  );
}