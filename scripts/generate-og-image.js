/**
 * Generate OG image as a simple PNG (1200x630)
 * Uses raw PNG encoding without external dependencies
 *
 * Run: node scripts/generate-og-image.js
 */
import { createWriteStream } from 'fs'
import { createDeflate } from 'zlib'

const WIDTH = 1200
const HEIGHT = 630

// AWS orange gradient background
const bgTop = [35, 47, 62]     // #232F3E (AWS dark)
const bgBottom = [255, 153, 0]  // #FF9900 (AWS orange)

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t)
}

function generatePNG() {
  // Build raw pixel data (RGBA)
  const rawData = Buffer.alloc(HEIGHT * (1 + WIDTH * 4))

  for (let y = 0; y < HEIGHT; y++) {
    const rowOffset = y * (1 + WIDTH * 4)
    rawData[rowOffset] = 0 // filter byte: None

    const t = y / HEIGHT
    const gradientStop = 0.6

    let r, g, b
    if (t < gradientStop) {
      // Dark section
      r = bgTop[0]
      g = bgTop[1]
      b = bgTop[2]
    } else {
      // Gradient to orange
      const gt = (t - gradientStop) / (1 - gradientStop)
      r = lerp(bgTop[0], bgBottom[0], gt)
      g = lerp(bgTop[1], bgBottom[1], gt)
      b = lerp(bgTop[2], bgBottom[2], gt)
    }

    for (let x = 0; x < WIDTH; x++) {
      const pixelOffset = rowOffset + 1 + x * 4
      rawData[pixelOffset] = r
      rawData[pixelOffset + 1] = g
      rawData[pixelOffset + 2] = b
      rawData[pixelOffset + 3] = 255
    }
  }

  // Draw a centered white rectangle area for "text" visual
  const boxX = 100, boxY = 150, boxW = 1000, boxH = 330
  for (let y = boxY; y < boxY + boxH; y++) {
    for (let x = boxX; x < boxX + boxW; x++) {
      const rowOffset = y * (1 + WIDTH * 4)
      const pixelOffset = rowOffset + 1 + x * 4
      // Semi-transparent white overlay
      rawData[pixelOffset] = lerp(rawData[pixelOffset], 255, 0.12)
      rawData[pixelOffset + 1] = lerp(rawData[pixelOffset + 1], 255, 0.12)
      rawData[pixelOffset + 2] = lerp(rawData[pixelOffset + 2], 255, 0.12)
    }
  }

  // Draw "AWS" text as pixel blocks (simplified large text)
  const letterA = [
    [0,0,1,1,0,0],
    [0,1,0,0,1,0],
    [1,0,0,0,0,1],
    [1,1,1,1,1,1],
    [1,0,0,0,0,1],
    [1,0,0,0,0,1],
  ]
  const letterW = [
    [1,0,0,0,0,1],
    [1,0,0,0,0,1],
    [1,0,0,1,0,1],
    [1,0,1,0,1,1],
    [1,1,0,0,1,1],
    [1,0,0,0,0,1],
  ]
  const letterS = [
    [0,1,1,1,1,0],
    [1,0,0,0,0,0],
    [0,1,1,1,1,0],
    [0,0,0,0,0,1],
    [0,0,0,0,0,1],
    [1,1,1,1,1,0],
  ]

  function drawLetter(letter, startX, startY, scale, color) {
    for (let row = 0; row < letter.length; row++) {
      for (let col = 0; col < letter[row].length; col++) {
        if (!letter[row][col]) continue
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            const px = startX + col * scale + dx
            const py = startY + row * scale + dy
            if (px >= 0 && px < WIDTH && py >= 0 && py < HEIGHT) {
              const rowOff = py * (1 + WIDTH * 4)
              const pixOff = rowOff + 1 + px * 4
              rawData[pixOff] = color[0]
              rawData[pixOff + 1] = color[1]
              rawData[pixOff + 2] = color[2]
            }
          }
        }
      }
    }
  }

  const scale = 16
  const textY = 200
  const totalLetterW = 6 * scale
  const gap = scale * 2
  const totalW = totalLetterW * 3 + gap * 2
  const startX = (WIDTH - totalW) / 2

  drawLetter(letterA, startX, textY, scale, [255, 153, 0])
  drawLetter(letterW, startX + totalLetterW + gap, textY, scale, [255, 153, 0])
  drawLetter(letterS, startX + (totalLetterW + gap) * 2, textY, scale, [255, 153, 0])

  // Encode PNG
  return new Promise((resolve, reject) => {
    const deflate = createDeflate({ level: 6 })
    const chunks = []
    deflate.on('data', chunk => chunks.push(chunk))
    deflate.on('end', () => {
      const compressedData = Buffer.concat(chunks)
      const png = encodePNG(WIDTH, HEIGHT, compressedData)
      resolve(png)
    })
    deflate.on('error', reject)
    deflate.end(rawData)
  })
}

function encodePNG(width, height, compressedData) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR chunk
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8  // bit depth
  ihdrData[9] = 6  // color type: RGBA
  ihdrData[10] = 0 // compression
  ihdrData[11] = 0 // filter
  ihdrData[12] = 0 // interlace
  const ihdr = makeChunk('IHDR', ihdrData)

  // IDAT chunk
  const idat = makeChunk('IDAT', compressedData)

  // IEND chunk
  const iend = makeChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdr, idat, iend])
}

function makeChunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)
  const typeBuffer = Buffer.from(type)
  const crc = crc32(Buffer.concat([typeBuffer, data]))
  const crcBuffer = Buffer.alloc(4)
  crcBuffer.writeUInt32BE(crc >>> 0, 0)
  return Buffer.concat([length, typeBuffer, data, crcBuffer])
}

// CRC32 implementation
function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0)
    }
  }
  return ~crc
}

async function main() {
  const png = await generatePNG()
  const stream = createWriteStream(new URL('../public/og-image.png', import.meta.url))
  stream.write(png)
  stream.end()
  console.log('OG image generated: public/og-image.png (' + png.length + ' bytes)')
}

main().catch(console.error)
