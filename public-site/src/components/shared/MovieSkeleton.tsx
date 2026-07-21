export function MovieSkeleton({ isHorizontal = false }: { isHorizontal?: boolean }) {
  return (
    <div 
      className={`w-full bg-surface animate-pulse rounded-md ${isHorizontal ? 'aspect-[16/9]' : 'aspect-[2/3]'}`}
    />
  );
}
