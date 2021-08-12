import { Button, notification, Space } from 'antd'

export const successNotify = (message, description) => {
  notification.open({
    message: message,
    description: description,
    type: 'success',
  })
}

export const errorNotify = (message, description) => {
  notification.open({
    message: message,
    description: description,
    type: 'error',
  })
}
