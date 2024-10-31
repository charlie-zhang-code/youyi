import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  startStream: () => {
    ipcRenderer.send('start_stream_text')
  },
  pauseStream: () => {
    ipcRenderer.send('pause_stream_text')
  },
  resumeStream: () => {
    ipcRenderer.send('resume_stream_text')
  },
  stopStream: () => {
    ipcRenderer.send('stop_stream_text')
  },
  onStreamLoading: (callback) => {
    ipcRenderer.on('stream_loading', callback)
  },
  onStreamStarted: (callback) => {
    ipcRenderer.on('stream_started', callback)
  },
  onStreamTextData: (callback) => {
    ipcRenderer.on('stream_text_data', callback)
  },
  getAllMeetings: () => {
    return new Promise((resolve) => {
      ipcRenderer.send('get-all-meetings')
      ipcRenderer.once('get-all-meetings-response', (_event, allMeetings) => {
        resolve(allMeetings)
      })
    })
  },

  insertMeeting: (data) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('insert-meeting', data)
      ipcRenderer.once('insert-meeting-response', (_event, response) => {
        if (response.success) {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  },
  getMeetingById: (meetingId) => {
    return new Promise((resolve) => {
      ipcRenderer.send('get-meeting-by-id', meetingId)
      ipcRenderer.once('get-meeting-by-id-response', (_event, meeting) => {
        resolve(meeting)
      })
    })
  },
  deleteMeetingById: (meetingId) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('delete-meeting-by-id', meetingId)
      ipcRenderer.once('delete-meeting-by-id-response', (_event, response) => {
        if (response.success) {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  },
  updateMeetingById: (meetingId, rawData) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('update-meeting', { meetingId, rawData })
      ipcRenderer.once('update-meeting-response', (_event, response) => {
        if (response.success) {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  },

  exportDocument: (rawData) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('export-document', { rawData })
      ipcRenderer.once('export-document-response', (_event, response) => {
        if (response.success) {
          resolve(response)
        } else {
          reject(response)
        }
      })
    })
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
