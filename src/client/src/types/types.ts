export interface User {
    guid: string,
    email: string,
    password: string,
    displayName: string,
    registryName: string,
    friends: User[]
}

export interface TripPost {
    guid: string,
    title: string,
    text: string,
    begin: Date,
    end: Date,
    created: Date,
    likes: number,
    user: {
        registryName: string,
        displayName: string,
        guid: string,
    }
    days: TripDay[]
}

export interface TripDay {
    guid: string,
    date: Date,
    title: string,
    text: string,
    images: any[],
}

export interface TripLocation {
    coordinates: string,
    images: any[]
}