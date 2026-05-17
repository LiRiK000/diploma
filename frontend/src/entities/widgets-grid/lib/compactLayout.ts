// import { Layout, Layouts } from 'react-grid-layout'
// import { GRID_COLS } from '../ui/Grid/model/constants'

// const collides = (a: Layout, b: Layout): boolean => {
//   if (a.i === b.i) return false
//   if (a.x + a.w <= b.x) return false
//   if (a.x >= b.x + b.w) return false
//   if (a.y + a.h <= b.y) return false
//   if (a.y >= b.y + b.h) return false
//   return true
// }

// const clampX = (item: Layout, cols: number): Layout => ({
//   ...item,
//   x: Math.max(0, Math.min(item.x, cols - item.w)),
//   y: Math.max(0, item.y),
// })

// const compactItem = (
//   placed: Layout[],
//   item: Layout,
//   cols: number,
// ): Layout => {
//   let next = clampX(item, cols)

//   for (let attempt = 0; attempt < 200; attempt += 1) {
//     const blocker = placed.find(other => collides(next, other))
//     if (!blocker) break
//     next = { ...next, y: blocker.y + blocker.h }
//   }

//   return next
// }

// /** Вертикальная укладка без пересечений (для сохранённых и финальных layout). */
// export const compactLayoutVertical = (layout: Layout[], cols: number): Layout[] => {
//   const sorted = [...layout].sort((a, b) => {
//     if (a.y !== b.y) return a.y - b.y
//     if (a.x !== b.x) return a.x - b.x
//     return a.i.localeCompare(b.i)
//   })

//   const placed: Layout[] = []
//   const byId = new Map<string, Layout>()

//   for (const raw of sorted) {
//     if (raw.static) {
//       const fixed = clampX(raw, cols)
//       placed.push(fixed)
//       byId.set(fixed.i, fixed)
//       continue
//     }

//     const compacted = compactItem(placed, raw, cols)
//     placed.push(compacted)
//     byId.set(compacted.i, compacted)
//   }

//   return layout.map(item => byId.get(item.i) ?? item)
// }

// export const resolveLayoutsNoOverlap = (layouts: Layouts): Layouts => {
//   const result: Layouts = {}

//   for (const [bp, items] of Object.entries(layouts)) {
//     if (!Array.isArray(items)) continue
//     const cols = GRID_COLS[bp as keyof typeof GRID_COLS] ?? GRID_COLS.lg
//     result[bp] = compactLayoutVertical(items, cols)
//   }

//   return result
// }
