export interface DiscussionThread {
  id: string;
  title: string;
  description?: string;
  memberCount: number;
  isMember: boolean;
  isMasked: boolean;
}
