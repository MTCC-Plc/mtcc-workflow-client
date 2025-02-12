import { WorkflowAppRequest } from './models/workflow-app-request.model';
import { WorkflowApp } from './models/workflow-app.model';
export declare class WorkflowAppService {
    private readonly workflowApiUrl;
    private readonly appId;
    private readonly privateToken;
    constructor();
    private fetchGraphQL;
    getAppWorkflows(): Promise<WorkflowApp[]>;
    getUserPendingRequests(userId: string): Promise<WorkflowAppRequest[]>;
    getSingleWorkflowRequest(requestId: number): Promise<WorkflowAppRequest>;
    createWorkflowRequest(userId: string, requestId: string, workflowId: number, requestDetails: string): Promise<string>;
    getPendingActions(userId: string): Promise<{
        appName: string;
        actions: {
            description: string;
            count: number;
            link: string;
        }[];
    }>;
    private getToken;
}
