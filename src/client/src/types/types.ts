export interface User {
    guid: string,
    email: string,
    password: string,
    displayName: string,
    registryName: string,
    friends: User[]
}

export interface TripPosts {
    guid: string,
    title: string,
    description: string,

}

export interface TripMap {
    guid: string
}

export interface TripDay {
    guid: string,
    date: Date,
    title: string,
    description: string
}

export interface TripLocation {
    guid: string,
    picture: string,    // url to image
    coordinates: any    // unknown frontend implementation
}