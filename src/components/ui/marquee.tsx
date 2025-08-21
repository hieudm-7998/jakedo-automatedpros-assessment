import { ReactNode } from "react"

type MarqueeProps<T> = {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
}

export default function Marquee<T>({ items, renderItem }: MarqueeProps<T>) {
  return (
    <div className="relative flex bg-secondary-background border-border w-full overflow-x-hidden font-base text-foreground">
      <div className="flex whitespace-nowrap animate-marquee">
        {items.map((item, index) => (
          <div key={index} className="mx-4">
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      <div className="top-0 absolute flex whitespace-nowrap animate-marquee2">
        {items.map((item, index) => (
          <div key={`dup-${index}`} className="mx-4">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
}
