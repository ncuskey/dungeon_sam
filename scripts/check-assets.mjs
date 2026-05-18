import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = process.cwd()
const sourceDirs = ['src']
const assetPattern = /['"`](\/[^'"`]+\.(?:png|jpe?g|webp|gif|mp3|wav|ogg))['"`]/g
const missing = new Set()

function walk(dir) {
    for (const entry of readdirSync(dir)) {
        const path = join(dir, entry)
        const stat = statSync(path)

        if (stat.isDirectory()) {
            walk(path)
            continue
        }

        if (!/\.(ts|tsx|js|jsx|css|html)$/.test(path)) continue

        const source = readFileSync(path, 'utf8')
        for (const match of source.matchAll(assetPattern)) {
            const publicPath = join(root, 'public', match[1].slice(1))
            if (!existsSync(publicPath)) {
                missing.add(`${match[1]} referenced in ${relative(root, path)}`)
            }
        }
    }
}

for (const dir of sourceDirs) {
    walk(join(root, dir))
}

if (missing.size > 0) {
    console.error('Missing public assets:')
    for (const asset of missing) {
        console.error(`- ${asset}`)
    }
    process.exit(1)
}

console.log('All referenced public assets exist.')
