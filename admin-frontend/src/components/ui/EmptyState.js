import Image from 'next/image';
import Button from './Button';

export default function EmptyState({
  title = 'No data found',
  description = 'Get started by creating your first item.',
  icon: Icon,
  image,
  actionLabel,
  onAction,
}) {
  return (
    <div className="text-center py-12">
      {image ? (
        <div className="relative mx-auto w-48 h-48 mb-6">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain"
          />
        </div>
      ) : Icon ? (
        <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
          <Icon className="w-12 h-12 text-gray-400" />
        </div>
      ) : null}

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}