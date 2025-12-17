import { TopLevelCategories } from 'src/top-page/top-page.model';

type RouteMapType = Record<TopLevelCategories, string>;

export const CATEGORY_URL: RouteMapType = {
  0: '/courses',
  1: '/services',
  2: '/books',
  3: '/products',
};
