
export type MonthlyCollaboratorStats = {
  month: string;
  collaborator: string;
  transferCount: number;
  commissionTotal: number;
};

export type CollaboratorStat = {
  name: string;
  transferCount: number;
  commissionTotal: number;
  averageCommission: number;
  transfers?: any[];
};
