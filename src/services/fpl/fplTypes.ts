export interface FplLeagueDetailsResponse {
  league: FplLeague;
  league_entries: FplLeagueEntry[];
  standings: FplStanding[];
}

export interface FplDraft {
  id: number;
  league: number;
  event: number;
  order_method: 'random' | string;
  draft_dt: string;
  draft_started: boolean;
  draft_completed: boolean | null;
}

export interface FplLeague {
  id: number;
  name: string;
  admin_entry: number;
  closed: boolean;
  draft_dt: string;
  draft_status: 'pre' | 'in_progress' | 'post' | string;
  draft_pick_time_limit: number;
  draft_tz_show: string;
  drafts: FplDraft[];
  is_renewed: boolean;
  ko_rounds: number;
  make_code_public: boolean;
  max_entries: number;
  min_entries: number;
  scoring: string;
  start_event: number;
  stop_event: number;
  trades: 'y' | 'n' | string;
  transaction_mode: string;
  variety: string;
}

export interface FplLeagueEntry {
  id: number;
  entry_id: number;
  entry_name: string;
  player_first_name: string;
  player_last_name: string;
  short_name: string;
  joined_time: string;
  waiver_pick: number | null;
}

export interface FplStanding {
  entry: number;
  rank: number;
  last_rank: number;
  total: number;
  event_total: number;
}