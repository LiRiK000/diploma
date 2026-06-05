import type { UploadFile } from 'antd/es/upload/interface'

export function getFileFromUploadList(
  fileList: UploadFile[],
): File | undefined {
  const item = fileList[0]
  if (!item) return undefined

  if (item.originFileObj instanceof File) {
    return item.originFileObj
  }

  return undefined
}
