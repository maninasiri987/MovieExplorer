import SkeletonCard from "./SkeletonCard";

function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array(count)
        .fill()
        .map((_, index) => (
          <SkeletonCard key={index} />
        ))}
    </div>
  );
}

export default SkeletonGrid;
