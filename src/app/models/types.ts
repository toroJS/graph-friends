type UserModel = {
    userId: string,
    createdAt: string,
    userName: string,
    email: string,
    avatarUrl?: string,
    intFreq?: number,
};

type EventModel = {
    eventId: string,
    eventType: 'sport' | 'eating' | 'drinking',
    eventDate: string,
    eventName: string,
    eventDescription: string,
}

