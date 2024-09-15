import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { Worker } from 'node:worker_threads'
import dbFile from '../../resources/db.sqlite?asset&asarUnpack'

import Database from 'better-sqlite3'

import audioWorker from './audio_worker.ts?modulePath'

let mainWindow: BrowserWindow | null = null

function initializeDatabase(dbPath) {
  const db = new Database(dbPath, { verbose: console.log })
  const createTableSQL =
    'CREATE TABLE IF NOT EXISTS meeting (' +
    '  `id`          INTEGER PRIMARY KEY, -- 会议ID\n' +
    '  `name`        TEXT NOT NULL,       -- 会议名称\n' +
    '  `location`    TEXT,                -- 会议地点\n' +
    '  `time`        TEXT,             -- 会议时间\n' +
    '  `tags`        TEXT,                -- 会议标签\n' +
    '  `description` TEXT,                -- 会议描述\n' +
    '  `status`      TEXT,                -- 会议状态\n' +
    '  `host`        TEXT,                -- 会议主持人\n' +
    '  `attendees`   TEXT,                -- 会议参与者\n' +
    '  `outline`     TEXT,                -- 会议大纲\n' +
    '  `subjects`    TEXT,                -- 会议议题\n' +
    '  `content`     TEXT,                -- 会议内容\n' +
    '  `duration`    TEXT,             -- 会议时长\n' +
    '  `created_at`  TEXT,             -- 会议创建时间\n' +
    '  `updated_at`  TEXT              -- 会议更新时间\n' +
    ')'
  const createTableStmt = db.prepare(createTableSQL)
  createTableStmt.run()
  return db
}

// 初始化数据库
const db = initializeDatabase(dbFile)

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 850,
    minHeight: 500,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    // ...(process.platform === 'linux' ? { icon } : {}),
    icon: icon,
    webPreferences: {
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegrationInWorker: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('win-status', { maximize: true })
  })
  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('win-status', { maximize: false })
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 最小化
  ipcMain.on('min-win', () => {
    mainWindow?.minimize()
  })
  // 最大化和还原
  ipcMain.on('max-restore', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow?.unmaximize()
      mainWindow?.webContents.send('win-status', { maximize: false })
    } else {
      mainWindow?.maximize()
      mainWindow?.webContents.send('win-status', { maximize: true })
    }
  })
  // 关闭窗口
  ipcMain.on('close-win', () => {
    mainWindow?.close()
  })

  let worker
  ipcMain.on('start_stream_text', (event) => {
    event.sender.send('stream_loading', {
      type: 'stream_loading',
      code: 200,
      endpoint: true,
      speaker: 'unknown',
      segment: 0,
      payload: null,
      time: new Date().getTime()
    })

    worker = new Worker(audioWorker)

    worker.on('message', (msg) => {
      if (msg.type === 'stream_started') {
        event.sender.send('stream_started', msg)
      }

      event.sender.send('stream_text_data', msg)
    })

    worker.on('error', (err) => {
      console.error('Worker error:', err)
    })

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`)
      }
    })
  })

  // 暂停流
  ipcMain.on('pause_stream_text', () => {
    if (worker) {
      worker.postMessage({ type: 'pause' })
    }
  })

  // 恢复流
  ipcMain.on('resume_stream_text', () => {
    if (worker) {
      worker.postMessage({ type: 'resume' })
    }
  })

  ipcMain.on('stop_stream_text', (event) => {
    if (worker) {
      worker.terminate()
      event.sender.send('stream_text_data', {
        type: 'stream_stopped',
        message: 'Stream has been stopped'
      })
    }
  })

  // 监听数据库操作请求
  ipcMain.on('insert-meeting', (event, rawData) => {
    // 解析JSON数据
    const data = JSON.parse(rawData)

    // 处理特定字段
    const {
      name,
      location,
      time,
      tags,
      description,
      status,
      host,
      attendees,
      outline,
      subjects,
      content,
      duration,
      created_at,
      updated_at
    } = data

    // 序列化数组字段
    const serializedTime = parseInt(time, 10)
    const serializedTags = JSON.stringify(tags)
    const serializedContent = JSON.stringify(content)

    // 准备SQL语句
    const sql = `
      INSERT INTO meeting(
        name,
        location,
        time,
        tags,
        description,
        status,
        host,
        attendees,
        outline,
        subjects,
        content,
        duration,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const insertStmt = db.prepare(sql)

    // 插入数据
    insertStmt.run(
      name,
      location,
      serializedTime,
      serializedTags,
      description,
      status,
      host,
      attendees,
      outline,
      subjects,
      serializedContent,
      duration,
      created_at,
      updated_at
    )

    event.sender.send('insert-meeting-response', { success: true })
  })

  ipcMain.on('get-all-meetings', (event) => {
    const allMeetings = db.prepare('SELECT * FROM meeting').all()
    event.sender.send('get-all-meetings-response', allMeetings)
  })

  ipcMain.on('get-meeting-by-id', (event, meetingId) => {
    const sql = 'SELECT * FROM meeting WHERE id = ?'
    const getMeetingStmt = db.prepare(sql)
    const meeting = getMeetingStmt.get(meetingId)
    event.sender.send('get-meeting-by-id-response', meeting)
  })

  ipcMain.on('delete-meeting-by-id', (event, meetingId) => {
    const sql = 'DELETE FROM meeting WHERE id = ?'
    const deleteMeetingStmt = db.prepare(sql)
    deleteMeetingStmt.run(meetingId)
    event.sender.send('delete-meeting-by-id-response', { success: true })
  })

  ipcMain.on('update-meeting', (event, { meetingId, rawData }) => {
    // 解析JSON数据
    const data = JSON.parse(rawData)

    // 处理特定字段
    const {
      name,
      location,
      time,
      tags,
      description,
      status,
      host,
      attendees,
      outline,
      subjects,
      content,
      duration,
      created_at,
      updated_at
    } = data

    // 序列化数组字段
    const serializedTags = JSON.stringify(tags)
    const serializedContent = JSON.stringify(content)

    // 准备SQL语句
    const sql = `
      UPDATE meeting SET
        name = ?,
        location = ?,
        time = ?,
        tags = ?,
        description = ?,
        status = ?,
        host = ?,
        attendees = ?,
        outline = ?,
        subjects = ?,
        content = ?,
        duration = ?,
        created_at = ?,
        updated_at = ?
        WHERE id = ?
    `
    const updateStmt = db.prepare(sql)

    // 插入数据
    updateStmt.run(
      name,
      location,
      time,
      serializedTags,
      description,
      status,
      host,
      attendees,
      outline,
      subjects,
      serializedContent,
      duration,
      created_at,
      updated_at,
      meetingId
    )

    event.sender.send('update-meeting-response', { success: true })
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
