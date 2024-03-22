import {
  ProductCard,
  ProductCardImage,
  ProductCardInfo,
} from '@bigcommerce/components/product-card';
import { Rating } from '@bigcommerce/components/rating';

import { Skeleton } from '../ui/skeleton';

export const DummyCard = () => {
  return (
    <ProductCard>
      <ProductCardImage>
        <div className="relative aspect-[4/5] flex-auto">
          <Skeleton className="h-full w-96" />
        </div>
      </ProductCardImage>
      <ProductCardInfo>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-60" />
        <Rating className="animate-pulse text-gray-200" size={16} value={5} />
        <div className="flex flex-wrap items-end justify-between pt-2">
          <Skeleton className="h-4 w-32" />
        </div>
      </ProductCardInfo>
    </ProductCard>
  );
};
