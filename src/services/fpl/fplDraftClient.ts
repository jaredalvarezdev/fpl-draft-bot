import type { FplLeagueDetailsResponse } from './fplTypes';

const BASE_URL = 'https://draft.premierleague.com/api';

export class FplDraftClient {
  async getLeagueDetails(leagueId: number): Promise<FplLeagueDetailsResponse> {
    const response = await fetch(`${BASE_URL}/league/${leagueId}/details`);

    if (!response.ok) {
      throw new Error(
        `Error al consultar la liga ${leagueId}: ${response.status} ${response.statusText}`,
      );
    }

    return response.json() as Promise<FplLeagueDetailsResponse>;
  }
}

export const fplDraftClient = new FplDraftClient();