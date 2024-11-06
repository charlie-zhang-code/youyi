from server.util.databaseUtil import DatabaseUtil


class Meeting:
    def __init__(
            self,
            meeting_id=None,
            meeting_name=None,
            meeting_tags=None,
            meeting_time=None,
            meeting_location=None,
            meeting_status=None,
            meeting_host=None,
            meeting_attendees=None,
            meeting_description=None,
            meeting_outline=None,
            meeting_subject=None,
            meeting_content=None,
            meeting_duration=None,
            meeting_created_at=None,
            meeting_updated_at=None
    ):
        self.meeting_id = meeting_id
        self.meeting_name = meeting_name
        self.meeting_tags = meeting_tags
        self.meeting_time = meeting_time
        self.meeting_location = meeting_location
        self.meeting_status = meeting_status
        self.meeting_host = meeting_host
        self.meeting_attendees = meeting_attendees
        self.meeting_description = meeting_description
        self.meeting_outline = meeting_outline
        self.meeting_subject = meeting_subject
        self.meeting_content = meeting_content
        self.meeting_duration = meeting_duration
        self.meeting_created_at = meeting_created_at
        self.meeting_updated_at = meeting_updated_at

        self.__db = DatabaseUtil()

    def __str__(self):
        return f"Meeting(meeting_id={self.meeting_id}, meeting_name={self.meeting_name}, meeting_tags={self.meeting_tags}, meeting_time={self.meeting_time}, meeting_location={self.meeting_location}, meeting_status={self.meeting_status}, meeting_host={self.meeting_host}, meeting_attendees={self.meeting_attendees}, meeting_description={self.meeting_description}, meeting_outline={self.meeting_outline}, meeting_subject={self.meeting_subject}, meeting_content={self.meeting_content}, meeting_duration={self.meeting_duration}, meeting_created_at={self.meeting_created_at}, meeting_updated_at={self.meeting_updated_at})"

    def get_meeting_by_id(self, meeting_id):
        meeting = self.__db.get(condition=f"meeting_id={meeting_id}")[0]
        self.meeting_id = meeting[0]
        self.meeting_name = meeting[1]
        self.meeting_tags = meeting[2]
        self.meeting_time = meeting[3]
        self.meeting_location = meeting[4]
        self.meeting_status = meeting[5]
        self.meeting_host = meeting[6]
        self.meeting_attendees = meeting[7]
        self.meeting_description = meeting[8]
        self.meeting_outline = meeting[9]
        self.meeting_subject = meeting[10]
        self.meeting_content = meeting[11]
        self.meeting_duration = meeting[12]
        self.meeting_created_at = meeting[13]
        self.meeting_updated_at = meeting[14]
        return self
