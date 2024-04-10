import { NextResponse } from 'next/server';

import { getAllTags } from '~/lib/contentful/api';

export const GET = async () => {
  const tags = await getAllTags();

  return NextResponse.json({ tags });
};

export const runtime = 'edge';
