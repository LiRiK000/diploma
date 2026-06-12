/**
 * Generates placeholder PWA icons from public/favicon.svg.
 * Replace files in public/icons/ with production assets when ready.
 *
 * Usage: node scripts/generate-pwa-icons.mjs
 */
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const iconsDir = path.join(rootDir, 'public', 'icons')
const sourceSvg = path.join(rootDir, 'public', 'favicon.svg')

const ICONS = [
  { name: 'icon-192x192.png', size: 192, maskable: false },
  { name: 'icon-512x512.png', size: 512, maskable: false },
  { name: 'icon-maskable-192x192.png', size: 192, maskable: true },
  { name: 'icon-maskable-512x512.png', size: 512, maskable: true },
]

const svgBuffer = await readFile(sourceSvg)

await mkdir(iconsDir, { recursive: true })

for (const icon of ICONS) {
  const outputPath = path.join(iconsDir, icon.name)
  const padding = icon.maskable ? Math.round(icon.size * 0.1) : 0
  const innerSize = icon.size - padding * 2

  const resized = await sharp(svgBuffer)
    .resize(innerSize, innerSize, { fit: 'contain', background: '#0f172a' })
    .png()
    .toBuffer()

  await sharp({
    create: {
      width: icon.size,
      height: icon.size,
      channels: 4,
      background: '#0f172a',
    },
  })
    .composite([{ input: resized, top: padding, left: padding }])
    .png()
    .toFile(outputPath)

  console.log(`Created ${outputPath}`)
}

await sharp(svgBuffer)
  .resize(180, 180, { fit: 'contain', background: '#0f172a' })
  .png()
  .toFile(path.join(rootDir, 'public', 'apple-touch-icon.png'))

console.log('Created public/apple-touch-icon.png')
