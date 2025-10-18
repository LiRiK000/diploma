import { Spin } from 'antd'

export const Loader = ({ fullscreen = true }: { fullscreen?: boolean }) => {
  return <Spin fullscreen={fullscreen} />
}
