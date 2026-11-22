import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';
import { getAllDepartements } from '@/lib/radars';
import { GUIDES } from '@/lib/guides';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const departements = getAllDepartements();

  const deptRoutes: MetadataRoute.Sitemap = departements.map((d) => ({
    url: absoluteUrl(`/departement/${d.code}`),
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: absoluteUrl(`/guide/${guide.slug}`),
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: absoluteUrl('/'),
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...deptRoutes,
    ...guideRoutes,
  ];
}
