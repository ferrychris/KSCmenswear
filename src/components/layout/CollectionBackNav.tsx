import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface CollectionBackNavProps {
  parentCollection: string;
  parentPath: string;
}

export function CollectionBackNav({ parentCollection, parentPath }: CollectionBackNavProps) {
  return (
    <Link 
      to={parentPath}
      className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
    >
      <ArrowLeft className="h-5 w-5 mr-2" />
      Back to {parentCollection}
    </Link>
  );
}