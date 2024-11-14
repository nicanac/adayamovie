export interface TMDBSession {
  success: boolean;
  session_id: string;
  expires_at?: string;
}

export interface TMDBRequestToken {
  success: boolean;
  expires_at: string;
  request_token: string;
}

export interface TMDBUser {
  id: number;
  name: string;
  username: string;
  avatar?: {
    gravatar?: {
      hash: string;
    };
    tmdb?: {
      avatar_path: string | null;
    };
  };
}

export interface TMDBError {
  status_message: string;
  status_code: number;
  success: boolean;
}
