import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { useQuery } from '@tanstack/react-query';
import { forwardRef, useDeferredValue, useId } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselNextIndicator,
  CarouselPreviousIndicator,
  CarouselSlide,
} from '@bigcommerce/components/carousel';

import { getQuickSearchResults } from '../../client/queries/get-quick-search-results';

import { DummyCard } from './dummy-card';
import { Pagination } from './pagination';
import { Product, ProductCard } from './product-card';

interface Props {
  title: string;
  categoryId?: number;
  className?: string;
}

type QuickSearchResults = Awaited<ReturnType<typeof getQuickSearchResults>>;

export const fetchQuickSearch = async ({ categoryId }: { categoryId?: number }) => {
  if (!categoryId) {
    return [];
  }

  const response = await fetch(
    `/api/quick-search?categoryId=${categoryId}&imageHeight=500&imageWidth=500&limit=10`,
    { next: { revalidate: 15 } },
  );

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const { products } = (await response.json()) as QuickSearchResults;

  return products.map((product) => ({
    ...product,
    productOptions: removeEdgesAndNodes(product.productOptions),
  }));
};

export const ProductCardCarousel = forwardRef<HTMLElement, Props>(
  ({ title, categoryId, className }, ref) => {
    const id = useId();
    const deferredQuery = useDeferredValue({ categoryId });

    const { data: products = [], isLoading } = useQuery({
      queryKey: ['quick-search-product-carousel', deferredQuery],
      queryFn: () => fetchQuickSearch(deferredQuery),
      enabled: !!categoryId,
    });

    if (products.length === 0) {
      return (
        <Carousel aria-labelledby="title" className={className} ref={ref}>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black lg:text-4xl" id="title">
              {title}
            </h2>
            <span className="no-wrap flex">
              <CarouselPreviousIndicator className="opacity-20" disabled />
              <CarouselNextIndicator className="opacity-20" disabled />
            </span>
          </div>
          <div className="mt-5 flex min-h-48 w-full items-center justify-center gap-4 lg:mt-6">
            {isLoading ? (
              <>
                <DummyCard />
                <DummyCard />
                <DummyCard />
                <DummyCard />
              </>
            ) : (
              <span className="text-lg opacity-20">Category has no products</span>
            )}
          </div>
        </Carousel>
      );
    }

    const groupedProducts = products.reduce<Array<Array<Partial<Product>>>>((batches, _, index) => {
      if (index % 4 === 0) {
        batches.push([]);
      }

      const product = products[index];

      if (batches[batches.length - 1] && product) {
        batches[batches.length - 1]?.push(product);
      }

      return batches;
    }, []);

    return (
      <Carousel aria-labelledby="title" className="mb-14" ref={ref}>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black lg:text-4xl" id="title">
            {title}
          </h2>
          <span className="no-wrap flex">
            <CarouselPreviousIndicator />
            <CarouselNextIndicator />
          </span>
        </div>
        <CarouselContent>
          {products.map((product, index) => (
            <CarouselSlide
              aria-label={`${index + 1} of ${groupedProducts.length}`}
              id={`${id}-slide-${index + 1}`}
              index={index}
              key={index}
            >
              <ProductCard imageSize="tall" key={product.entityId} product={product} />
            </CarouselSlide>
          ))}
        </CarouselContent>
        <Pagination groupedProducts={groupedProducts} id={id} />
      </Carousel>
    );
  },
);
