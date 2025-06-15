export class WorkflowUser {
  id!: number;
  fullName!: string;
  userId!: string;
  email!: string;
  rcno?: string;
}

export class WorkflowRequestStep {
  id!: number;
  actionTakenDate?: string;
  workflowStepId?: number;
  workflowRequestId?: number;
  remarks?: string;
  state!: string;
  actionTakenBy?: WorkflowUser;
}

export class WorkflowAppRequest {
  id!: string;
  requestId!: string;
  isCompleted!: boolean;
  isReceived!: boolean;

  workflowRequestSteps?: WorkflowRequestStep[]; // ✅ Add this
}
