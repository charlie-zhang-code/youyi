export function createTimer(callback) {
  let hour = 0
  let minute = 0
  let ms = 0
  let second = 0
  let timerId
  let isPaused = false

  function timer() {
    if (isPaused) return // 如果处于暂停状态，则不更新时间

    ms += 50
    if (ms >= 1000) {
      ms = 0
      second++
    }
    if (second >= 60) {
      second = 0
      minute++
    }
    if (minute >= 60) {
      minute = 0
      hour++
    }
    const str = toDub(hour) + ':' + toDub(minute) + ':' + toDub(second)
    const totalSeconds = hour * 3600 + minute * 60 + second // 计算总秒数
    callback(str, isPaused, totalSeconds)
  }

  function toDub(n) {
    return n < 10 ? '0' + n : '' + n
  }

  function start() {
    isPaused = false
    timerId = setInterval(timer, 50)
    const totalSeconds = hour * 3600 + minute * 60 + second // 计算总秒数
    callback(toDub(hour) + ':' + toDub(minute) + ':' + toDub(second), isPaused, totalSeconds) // 调用一次以更新时间
  }

  function stop() {
    isPaused = true
    clearInterval(timerId)
    const totalSeconds = hour * 3600 + minute * 60 + second // 计算总秒数
    callback(toDub(hour) + ':' + toDub(minute) + ':' + toDub(second), isPaused, totalSeconds) // 调用一次以更新暂停状态
  }

  function reset() {
    stop()
    hour = 0
    minute = 0
    ms = 0
    second = 0
    isPaused = false // 确保重置时暂停状态也被重置
    callback('00:00:00', isPaused, 0) // 调用一次以更新时间和暂停状态
  }

  return { start, stop, reset }
}

export const formatDateTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  const times = date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // 24小时制
  })
  return times
}
