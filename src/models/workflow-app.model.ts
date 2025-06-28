export class WorkflowApp {
  id!: number;
  workflowName!: string;
  workflowSteps?: {
    id: number;
    stepName: string;
    position: number;
    description?: string;
    workflowStepActionAllowedUsers: {
      id: number;
      approverPriority: number;
      user: {
        id: number;
        userId: string;
        fullName: string;
        email: string;
        rcno: string;
      };
    }[];
  }[];
}
