import Image from 'next/image';
import { forwardRef, Ref } from 'react';

import { Link } from '~/components/link';
import { cn } from '~/lib/utils';

import { Button } from '../button';

export interface Props {
  className?: string;
  link?: {
    href: string;
    target?: '_self' | '_blank';
  };
  image?: { url: string; dimensions: { width: number; height: number } };
  imageAlt: string;
  buttonText?: string;
}

export const ProductPreview = forwardRef(function ProductPreview(
  { className, link, image, imageAlt, buttonText }: Props,
  ref: Ref<HTMLAnchorElement>,
) {
  return (
    <Link
      className={cn(className, 'group relative block aspect-[3/4] w-full overflow-hidden')}
      href={link?.href ?? '#'}
      ref={ref}
    >
      {image ? (
        <Image
          alt={imageAlt}
          className="scale-100 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          fill
          src={image.url}
        />
      ) : (
        <div className="aspect-[3/4] w-full bg-gray-100" />
      )}

      <div className="absolute inset-x-0 bottom-0 flex translate-y-0 justify-center p-4 transition-transform duration-300 group-hover:translate-y-0 sm:translate-y-full">
        <Button variant="primary">{buttonText}</Button>
      </div>
    </Link>
  );
});
