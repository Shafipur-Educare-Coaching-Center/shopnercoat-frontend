import { Suspense } from 'react';
import { getPublicAnnouncements } from '@/server/announcement.service';
import { PageHeader } from '@/components/common/PageHeader';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerChildren, StaggerItem } from '@/components/animations/StaggerChildren';

export const revalidate = 3600;

export default async function HomePage() {
  const announcements = await getPublicAnnouncements().catch(() => []);

  return (
    <div className="container py-12 space-y-16">
      <FadeIn>
        <section className="text-center py-20 bg-teal-50/50 rounded-3xl border">
          <h1 className="text-4xl md:text-6xl font-bold font-heading text-primary mb-6">Medical Admission Preparation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Complete examination and result management system for your medical admission journey.
          </p>
        </section>
      </FadeIn>

      <section>
        <PageHeader title="Latest Announcements" />
        <StaggerChildren className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {announcements.slice(0, 3).map((ann) => (
            <StaggerItem key={ann.id}>
              <div className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2">{ann.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{ann.content}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>
    </div>
  );
}
