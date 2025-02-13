import { WorkflowAppRequest } from './models/workflow-app-request.model';
import { WorkflowApp } from './models/workflow-app.model';
export declare class WorkflowAppService {
    private readonly workflowApiUrl;
    private readonly appId;
    private readonly privateToken;
    constructor();
    private validateEnvVariables;
    private fetchGraphQL;
    getAppWorkflows(): Promise<WorkflowApp[]>;
    getUserPendingRequests(userId: string): Promise<WorkflowAppRequest[]>;
    getSingleWorkflowRequest(requestId: number): Promise<WorkflowAppRequest>;
    workflowRequestByReferenceId(id: string): Promise<WorkflowAppRequest | null>;
    createWorkflowRequest(userId: string | null, requestId: string, workflowId: number, requestDetails: string, isEmployee?: boolean): Promise<string>;
    getPendingActions(userId: string): Promise<{
        appName: string;
        actions: {
            description: string;
            count: number;
            link: string;
        }[];
    }>;
    workflowRequestTakeAction(workflowStepId: number, action: string, remarks: string, userId: string): Promise<any>;
    private getToken;
}
