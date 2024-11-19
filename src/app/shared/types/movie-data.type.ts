export type Genre = {
  id: number;
  name: string;
};

export type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};

export type MovieData = {
  videos: any;
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  genre_ids: number[];
  video: boolean;
  genres?: Genre[];
  credits?: {
    cast: Cast[];
  };
};

export type ReviewDetails = {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  iso_639_1: string;
  media_id: number;
  media_title: string;
  url: string;
  updated_at: string;
};
