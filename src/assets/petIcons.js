const files = import.meta.glob('./pets/*.jpg', { eager: true, query: '?url', import: 'default' })

const urls = new Map(
  Object.entries(files).map(([path, url]) => [path.split('/').pop().replace(/\.jpg$/, ''), url]),
)

export function getPetIcon(id) {
  return urls.get(id) ?? null
}
