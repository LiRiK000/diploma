import { FC } from 'react'
import classes from './WidgetWrapper.module.scss'
import { EmptyContent } from './ui/EmptyContent/EmptyContent'
import { Loader } from '../Loader'
import { IWidgetWrapper } from './types'

export const WidgetWrapper: FC<IWidgetWrapper> = props => {
  const isShowHeader = props.afterTitle || props.beforeTitle || props.title

  return (
    <div
      className={`${classes.container} ${props.className}`}
      style={props.style}
    >
      {isShowHeader && (
        <div className={classes.header}>
          <div className={classes.title}>
            {props.beforeTitle}
            <h4 className={classes['title__text']}>{props.title}</h4>
            {props.afterTitle}
          </div>
          {props.headerContent}
        </div>
      )}
      <div className={`${classes.content} ${props.contentClass ?? ''}`}>
        <WidgetWrapperContent {...props}>{props.children}</WidgetWrapperContent>
      </div>
    </div>
  )
}

const WidgetWrapperContent: FC<IWidgetWrapper> = props => {
  if (props.isLoading) {
    return <EmptyContent message={<Loader fullscreen={false} />} />
  }
  if (props.isEmpty) {
    return <EmptyContent message={props.emptyMessage || 'Отсутствуют данные'} />
  }
  return <>{props.children}</>
}
