interface MeetingStatus {
  meetingData: Data.MeetingFormValue
  generateData: Data.MeetingFormValue
}

export const useMeetingStore = defineStore('meeting', {
  state: (): MeetingStatus => ({
    meetingData: {
      name: '',
      location: '',
      time: 0,
      tags: [],
      description: '',
      status: '',
      host: '',
      attendees: '',
      outline: '',
      subjects: '',
      content: [],
      duration: '',
      created_at: '',
      updated_at: ''
    },
    generateData: {
      name: '',
      location: '',
      time: 0,
      tags: [],
      description: '',
      status: '',
      host: '',
      attendees: '',
      outline: '',
      subjects: '',
      content: [],
      duration: '',
      created_at: '',
      updated_at: ''
    }
  }),
  actions: {
    setMeetingData(data) {
      this.meetingData = data
    },
    setGenerateData(data) {
      this.generateData = data
    },
    clearMeetingData() {
      this.generateData = {
        name: '',
        location: '',
        time: 0,
        tags: [],
        description: '',
        status: '',
        host: '',
        attendees: '',
        outline: '',
        subjects: '',
        content: [],
        duration: '',
        created_at: '',
        updated_at: ''
      }
    },
    clearGenerateData() {
      this.meetingData = {
        name: '',
        location: '',
        time: 0,
        tags: [],
        description: '',
        status: '',
        host: '',
        attendees: '',
        outline: '',
        subjects: '',
        content: [],
        duration: '',
        created_at: '',
        updated_at: ''
      }
    }
  }
})
