import React from "react";

// #skeleton_loader
export function SkeletonLoader({ width = "100%", height = "20px", count = 1 }) {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div key={i} className="skeleton-item" style={{ width, height }} />
  ));

  return <>{skeletons}</>;
}

// #card_skeleton
export function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <SkeletonLoader width="60%" height="24px" />
      <SkeletonLoader count={3} height="16px" />
    </div>
  );
}

/**
 * Loading Spinner
 */
export function LoadingSpinner({ size = "40px", text = "Loading..." }) {
  return (
    <div className="loading-spinner-wrapper">
      <div
        className="loading-spinner-circle"
        style={{ width: size, height: size }}
      />
      {text && <p className="loading-spinner-text">{text}</p>}
    </div>
  );
}

/**
 * Wrapper component for loading states
 */
export function LoadingWrapper({
  isLoading,
  error,
  children,
  fallback = null,
}) {
  if (isLoading) {
    return fallback || <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="loading-wrapper-error">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return children;
}
