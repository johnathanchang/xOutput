"use client";

export default function DollarBackground() {
  const columnCount = 20;
  const rowCount = 40;

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none select-none"
      style={{ zIndex: 0, opacity: 0.12 }}
    >
      <div className="flex h-full w-full">
        {Array.from({ length: columnCount }).map((_, col) => (
          <div
            key={col}
            className="flex-1 flex flex-col items-center text-green-500 text-xl leading-relaxed"
            style={{
              animation: `${col % 2 === 0 ? "dollarUp" : "dollarDown"} 15s linear infinite`,
            }}
          >
            {Array.from({ length: rowCount * 2 }).map((_, row) => (
              <span key={row}>$</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
