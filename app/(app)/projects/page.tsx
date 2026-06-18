import Link from "next/link"

import { ProjectTable } from "@/components/app/project-table"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { listProjectsPage } from "@/lib/actions/project"
import { cn } from "@/lib/utils"

function pageHref(page: number) {
  return page <= 1 ? "/projects" : `/projects?page=${page}`
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const params = await searchParams
  const requestedPage = Number.parseInt(
    Array.isArray(params.page) ? params.page[0] : params.page ?? "1",
    10,
  )

  const result = await listProjectsPage(
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1,
  )

  if (result.error || !result.data) {
    return <p className="text-sm text-destructive">{result.error}</p>
  }

  const data = result.data
  const start = data.totalCount === 0 ? 0 : (data.page - 1) * data.pageSize + 1
  const end = Math.min(data.page * data.pageSize, data.totalCount)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">프로젝트</h1>
          <p className="text-sm text-muted-foreground">
            최근 수정된 프로젝트부터 빠르게 훑어봅니다.
          </p>
        </div>
        <Button size="sm">새 프로젝트</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>목록</CardTitle>
          <CardDescription>
            {data.totalCount === 0
              ? "프로젝트가 아직 없습니다."
              : `${start}-${end} / ${data.totalCount}개`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProjectTable projects={data.projects} />

          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <span className="text-sm text-muted-foreground">
              {data.totalPages}페이지 중 {data.page}페이지
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={pageHref(data.page - 1)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  !data.hasPrevious && "pointer-events-none opacity-50",
                )}
                aria-disabled={!data.hasPrevious}
                tabIndex={!data.hasPrevious ? -1 : undefined}
              >
                이전
              </Link>
              <Link
                href={pageHref(data.page + 1)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  !data.hasNext && "pointer-events-none opacity-50",
                )}
                aria-disabled={!data.hasNext}
                tabIndex={!data.hasNext ? -1 : undefined}
              >
                다음
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
