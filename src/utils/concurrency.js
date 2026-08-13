export async function mapWithConcurrency(items, limit, worker) {
  const results = Array.from({ length: items.length })
  let cursor = 0

  async function runNext() {
    const current = cursor
    cursor += 1
    if (current >= items.length) return
    results[current] = await worker(items[current], current)
    await runNext()
  }

  const runners = Array.from({ length: Math.min(limit, items.length) }, () => runNext())
  await Promise.all(runners)
  return results
}