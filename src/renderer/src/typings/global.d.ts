declare namespace Data {
  interface StreamData {
    type: string
    code: number
    endpoint: boolean
    speaker: string
    segment: string | number
    payload: string
    time: string
  }

  interface MeetingFormValue {
    id?: number
    name: string
    location: string
    time: number
    tags: string[]
    description: string
    status: string
    host: string
    attendees: string
    outline: string
    subjects: string
    content: StreamData[]
    duration: string
    created_at: string
    updated_at: string
  }
}
