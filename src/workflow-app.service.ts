import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { WorkflowAppRequest } from './models/workflow-app-request.model';
import { WorkflowApp } from './models/workflow-app.model';
// import { ProjectWorkflowTypeEnum } from './enums/project-workflow-type.enum';

export class WorkflowAppService {
  private readonly workflowApiUrl: string;
  private readonly appId: number;
  private readonly privateToken: string;

  constructor() {
    this.workflowApiUrl = process.env.WORKFLOW_API_URL || '';
    this.appId = Number(process.env.WORKFLOW_API_ID) || 0;
    this.privateToken = process.env.WORKFLOW_API_PRIVATE_TOKEN || '';

    if (!this.workflowApiUrl || !this.privateToken || !this.appId) {
      throw new Error('Missing required environment variables for WorkflowAppService');
    }
  }

  private async fetchGraphQL(query: object) {
    try {
      const response = await axios.post(this.workflowApiUrl, JSON.stringify(query), {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status}`);
      }

      return response.data.data;
    } catch (error) {
      console.error('GraphQL API Error:', error);
      throw new Error('Failed to fetch data from Workflow API');
    }
  }

  async getAppWorkflows(): Promise<WorkflowApp[]> {
    const query = {
      operationName: 'getWorkflowsByAppID',
      variables: { id: this.appId },
      query: `
        query getWorkflowsByAppID($id: Int!) {
          getWorkflowsByAppID(id: $id) {
            id
            workflowName
            workflowSteps {
              id
              stepName
            }
          }
        }
      `,
    };

    const data = await this.fetchGraphQL(query);
    return data?.getWorkflowsByAppID?.map((workflow: any) =>
      Object.assign(new WorkflowApp(), workflow)
    ) || [];
  }

  async getUserPendingRequests(userId: string): Promise<WorkflowAppRequest[]> {
    const query = {
      operationName: 'getUserPendingWorkflowRequestApproval',
      variables: { userId },
      query: `
        query getUserPendingWorkflowRequestApproval($userId: String!) {
          getUserPendingWorkflowRequestApproval(userId: $userId) {
            id
            isCompleted
            isReceived
            requestId
          }
        }
      `,
    };

    const data = await this.fetchGraphQL(query);
    return data?.getUserPendingWorkflowRequestApproval?.map((req: any) =>
      Object.assign(new WorkflowAppRequest(), req)
    ) || [];
  }

  async getSingleWorkflowRequest(requestId: number): Promise<WorkflowAppRequest> {
    const query = {
      operationName: 'workflowRequest',
      variables: { id: requestId },
      query: `
        query workflowRequest($id: Int!) {
          workflowRequest(id: $id) {
            id
            isCompleted
            isReceived
            requestId
            requestDetails
          }
        }
      `,
    };

    const data = await this.fetchGraphQL(query);
    return Object.assign(new WorkflowAppRequest(), data?.workflowRequest || {});
  }

  async createWorkflowRequest(
    userId: string,
    requestId: string,
    workflowId: number,
    requestDetails: string
  ): Promise<string> {
    const query = {
      operationName: 'createWorkflowRequest',
      variables: {
        createWorkflowRequestInput: {
          appId: this.appId,
          requestDetails,
          requestId,
          userId,
          workflowId,
        },
        isEmployee: true,
      },
      query: `
        mutation createWorkflowRequest($createWorkflowRequestInput: CreateWorkflowRequestInput!, $isEmployee: Boolean) {
          createWorkflowRequest(createWorkflowRequestInput: $createWorkflowRequestInput, isEmployee: $isEmployee) {
            id
          }
        }
      `,
    };

    const data = await this.fetchGraphQL(query);
    return data?.createWorkflowRequest?.id || '';
  }

//   async cancelWorkflowRequest(requestId: string, type: ProjectWorkflowTypeEnum): Promise<boolean> {
//     try {
//       const whereCondition: any = { requestId };

//       switch (type) {
//         case ProjectWorkflowTypeEnum.ProjectCreation:
//           whereCondition.projectCreationId = { not: null };
//           break;
//         case ProjectWorkflowTypeEnum.ProjectModification:
//           whereCondition.projectModificationId = { not: null };
//           break;
//         case ProjectWorkflowTypeEnum.Variation:
//           whereCondition.projectVariationId = { not: null };
//           break;
//         case ProjectWorkflowTypeEnum.MachineTransferRequest:
//           whereCondition.machineTransferRequestId = { not: null };
//           break;
//         default:
//           throw new Error('Unsupported workflow type');
//       }

//       // Simulate delete operation (replace with actual DB call if needed)
//       console.log('Deleting request:', whereCondition);
//       return true;
//     } catch (error) {
//       console.error(error);
//       throw new Error('Unexpected error occurred while cancelling workflow request.');
//     }
//   }

  async getPendingActions(userId: string) {
    try {
      const appRequests = await this.getUserPendingRequests(userId);

      const actions = appRequests.map((req) => ({
        description: 'Pending Approval',
        count: 1,
        link: `${process.env.APP_URL}/approvals/${req.requestId}`,
      }));

      return {
        appName: 'PMS',
        actions,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Workflow Pending Actions Failed.');
    }
  }

  private getToken(): string {
    return jwt.sign(
      { sub: this.appId, type: 'app' },
      Buffer.from(this.privateToken, 'base64').toString('ascii'),
      { algorithm: 'RS256' }
    );
  }
}
