import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

export const Loader = ({ fullscreen = true }: { fullscreen?: boolean }) => {
  return <Spin fullscreen={fullscreen} indicator={<LoadingOutlined spin />} />
}
