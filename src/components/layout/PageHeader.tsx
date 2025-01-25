import { BackButton } from './BackButton';

interface PageHeaderProps {
  title: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
}

export function PageHeader({ title, description, backTo, backLabel }: PageHeaderProps) {
  return (
    <div className="bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {backTo && backLabel && (
          <BackButton 
            to={backTo} 
            label={backLabel} 
            className="mb-6" 
          />
        )}
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-lg text-gray-600">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}