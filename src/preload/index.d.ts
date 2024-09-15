import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      $loadingBar: import('naive-ui').LoadingBarApi
      $dialog: import('naive-ui').DialogApi
      $message: import('naive-ui').MessageApi
      $notification: import('naive-ui').NotificationApi

      startStream: () => void
      pauseStream: () => void
      resumeStream: () => void
      stopStream: () => void
      onStreamLoading: (callback) => void
      onStreamStarted: (callback) => void
      onStreamTextData: (callback) => void

      getAllMeetings: () => Promise
      insertMeeting: (data) => Promise
      getMeetingById: (meetingId) => Promise
      deleteMeetingById: (meetingId) => Promise
      updateMeetingById: (meetingId, rawData) => Promise
    }
  }
}
