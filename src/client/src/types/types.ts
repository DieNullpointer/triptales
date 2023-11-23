export interface User {
  guid: string;
  email: string;
  password: string;
  displayName: string;
  registryName: string;
  description: string;
  friends: User[];
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
  user: {
    registryName: string;
    displayName: string;
    guid: string;
  };
  images: [{ image: string }];
  days: TripDay[];
}

export interface TripDay {
  guid: string;
  date: Date;
  title: string;
  text: string;
  images: [{ image: string }];
}

export interface TripLocation {
  coordinates: string;
  images: [{ image: string }];
}
