import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-5 pb-32 sm:px-6 sm:py-6 md:pb-10 lg:px-8 lg:py-8 lg:pb-8">
        <div className="space-y-10 lg:space-y-12">
          {/* SECTION 1 - Hero Product Section */}
          <section className="grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-8">
            <div className="min-w-0 space-y-4">
              <Skeleton className="aspect-[4/3.7] w-full rounded-[22px] sm:aspect-square sm:rounded-[28px]" />
              <div className="flex gap-2 overflow-hidden sm:grid sm:grid-cols-5 sm:gap-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Skeleton
                    key={item}
                    className="h-16 w-16 shrink-0 rounded-2xl sm:h-auto sm:w-auto sm:aspect-square"
                  />
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <div className="rounded-[26px] border border-green-100 bg-white p-4 shadow-[0_24px_60px_rgba(17,24,39,0.06)] sm:rounded-[32px] sm:p-6">
                <div className="space-y-4 sm:space-y-5">
                  <div className="space-y-2.5 sm:space-y-3">
                    <Skeleton className="h-6 w-28 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-3/4 sm:h-10" />
                      <Skeleton className="h-4 w-full sm:h-5" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-2xl sm:w-72" />
                  </div>

                  <div className="rounded-[24px] border border-green-100 bg-[#F0FAF3] p-3.5 sm:rounded-[28px] sm:p-5">
                    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-green-100 pb-4">
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-40 sm:h-12" />
                        <Skeleton className="h-4 w-56" />
                      </div>
                      <Skeleton className="h-7 w-28 rounded-full" />
                    </div>

                    <div className="mt-4 space-y-4">
                      <Skeleton className="h-3 w-24" />
                      <div className="grid grid-cols-2 gap-3 lg:gap-4">
                        {[1, 2, 3, 4].map((item) => (
                          <Skeleton key={item} className="min-h-[160px] rounded-[24px]" />
                        ))}
                      </div>

                      <div className="flex items-center justify-between rounded-2xl border border-green-100 bg-white px-4 py-3">
                        <Skeleton className="h-5 w-20" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-5 w-8" />
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                      </div>

                      <Skeleton className="hidden h-14 w-full rounded-2xl md:block" />

                      <div className="space-y-4">
                        <Skeleton className="h-12 w-full rounded-2xl" />
                        <Skeleton className="h-12 w-full rounded-2xl" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2 - What's In The Box */}
          <section className="rounded-[24px] border border-green-100 bg-[#F0FAF3] p-4 shadow-[0_20px_46px_rgba(17,24,39,0.05)] sm:rounded-[32px] sm:p-8">
            <div className="max-w-4xl space-y-3 sm:space-y-4">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-8 w-4/5 sm:h-10 sm:w-1/2" />
            </div>

            <div className="mt-4 rounded-[22px] border border-white/80 bg-white p-4 shadow-sm sm:mt-6 sm:rounded-[28px] sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </section>

          {/* SECTION 3 - Why It's Different */}
          <section className="relative overflow-hidden rounded-[28px] border border-green-100 bg-gradient-to-br from-white via-[#FCFFFD] to-[#F0FAF3] px-4 py-6 shadow-[0_24px_56px_rgba(15,23,42,0.05)] md:p-6 lg:p-8">
            <div className="relative grid gap-7 md:gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-8">
              <div className="space-y-5 md:space-y-4">
                <Skeleton className="h-6 w-36 rounded-full" />
                <div className="space-y-3">
                  <Skeleton className="h-8 w-4/5 sm:h-10" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                </div>
                <div className="flex flex-wrap gap-2 pt-2 md:pt-1">
                  <Skeleton className="h-10 w-32 rounded-full" />
                  <Skeleton className="h-10 w-48 rounded-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[10px] md:grid-cols-2 md:gap-4 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Skeleton key={item} className="h-32 rounded-2xl" />
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4 - Customer Reviews */}
          <section className="scroll-mt-24">
            <div className="rounded-[32px] border border-green-100 bg-[#F0FAF3] p-6 shadow-[0_24px_60px_rgba(17,24,39,0.05)] sm:p-8">
              <div className="space-y-5 sm:space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-32 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-64" />
                      <Skeleton className="h-4 w-72" />
                    </div>
                  </div>
                  <Skeleton className="h-12 w-full rounded-2xl sm:w-56" />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <Skeleton className="h-44 rounded-[28px] bg-white" />
                  <Skeleton className="h-44 rounded-[28px] bg-white" />
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <Skeleton key={item} className="h-32 rounded-[28px] bg-white" />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Mobile sticky CTA placeholder */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-green-200 bg-white/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-[0_-18px_40px_rgba(17,24,39,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 overflow-hidden">
          <div className="min-w-0 flex-1 space-y-1">
            <Skeleton className="h-3 w-20 rounded-full" />
            <div className="flex items-end gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
          <Skeleton className="h-12 min-w-[132px] rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
