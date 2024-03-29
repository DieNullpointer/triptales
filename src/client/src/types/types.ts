export interface Response {
  status: number;
  success: boolean;
  data: any;
}

export interface Image {
  contentType: string;
  fileContents: string;
}

export interface Notification {
  text: string,
  notificationType: "Follow" | "Like" | "System"
  isRead: boolean
}

export interface User {
  guid: string;
  email?: string;
  favDestination?: string;
  origin?: string;
  password: string;
  displayName: string;
  registryName: string;
  description: string;
  friends: User[];
  followerCount: number;
  followingCount: number;
  follow?: boolean;
}

export interface ProfileUser {
  user: User;
  profile: string;
  banner: string;
}

export interface TripPost {
  guid: string;
  title: string;
  text: string;
  begin: Date;
  end: Date;
  created: Date;
  likes: number;
  liking: boolean;
  user: {
    registryName: string;
    displayName: string;
    guid: string;
    profilePicture: string;
  };
  images: string[];
  days: TripDay[];
}

export interface TripDay {
  guid: string;
  date: any;
  title: string;
  text: string;
}

export interface TripLocation {
  coordinates: string;
  images: [{ image: string }];
}
