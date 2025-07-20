import { Skeleton } from "@heroui/react";

function LoadingSkeleton() {
  return (
    <div className="">
      <div>
        <Skeleton className="w-30 mb-4 flex h-6 rounded-xl" />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
      <div className="my-5">
        <div>
          <Skeleton className="w-8/10 mx-auto flex h-20 rounded-xl" />
        </div>
      </div>
      <div className="my-5">
        <div>
          <Skeleton className="w-8/10 mx-auto flex h-20 rounded-xl" />
        </div>
      </div>
      <div className="my-5">
        <div>
          <Skeleton className="w-8/10 mx-auto flex h-20 rounded-xl" />
        </div>
      </div>
      <div className="my-5">
        <div>
          <Skeleton className="w-8/10 mx-auto flex h-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default LoadingSkeleton;
