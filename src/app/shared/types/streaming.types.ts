export interface StreamingProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}
export interface MovieStreamingProviders {
  [movieId: number]: StreamingProvider[];
}
export interface MovieAvailability {
  id: number;
  results: {
    [countryCode: string]: {
      flatrate?: StreamingProvider[];
      rent?: StreamingProvider[];
      buy?: StreamingProvider[];
      free?: StreamingProvider[];
    };
  };
}
