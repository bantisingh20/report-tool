import { environment } from '../environments/environment';

export const API_URL = environment.production
  ? environment.prodApiUrl
  : environment.localApiUrl;