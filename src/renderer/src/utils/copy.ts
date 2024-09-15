export async function copyToClipboard(data, callback?: (message: string, data?: string) => void) {
  try {
    await navigator.clipboard.writeText(data)
    callback?.('复制成功', data)
  } catch (err) {
    callback?.('复制失败', data)
  }
}

export const showCopyButtonIndex = ref(0)

export function showCopyButton(index: number) {
  showCopyButtonIndex.value = index
}

export function hideCopyButton() {
  showCopyButtonIndex.value = -1
}
