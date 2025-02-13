"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowAppService = void 0;
const axios_1 = require("axios");
const jwt = require("jsonwebtoken");
const workflow_app_request_model_1 = require("./models/workflow-app-request.model");
const workflow_app_model_1 = require("./models/workflow-app.model");
// import { ProjectWorkflowTypeEnum } from './enums/project-workflow-type.enum';
class WorkflowAppService {
    constructor() {
        this.workflowApiUrl = process.env.WORKFLOW_API_URL || '';
        this.appId = Number(process.env.WORKFLOW_API_ID) || 0;
        this.privateToken = process.env.WORKFLOW_API_PRIVATE_TOKEN || '';
        this.validateEnvVariables();
    }
    validateEnvVariables() {
        const missingVars = [];
        if (!this.workflowApiUrl)
            missingVars.push('WORKFLOW_API_URL');
        if (!this.appId)
            missingVars.push('WORKFLOW_API_ID');
        if (!this.privateToken)
            missingVars.push('WORKFLOW_API_PRIVATE_TOKEN');
        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}. ` +
                `\n Ensure these variables are set in your .env file or system environment.`);
        }
    }
    fetchGraphQL(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(this.workflowApiUrl, JSON.stringify(query), {
                    headers: {
                        Authorization: `Bearer ${this.getToken()}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status !== 200) {
                    throw new Error(`Unexpected response status: ${response.status}`);
                }
                return response.data.data;
            }
            catch (error) {
                if (error.response) {
                    if (error.response.status === 401 || error.response.status === 403) {
                        throw new Error(`Authentication Failed: Invalid or unauthorized API token. ` +
                            `\n Check your WORKFLOW_API_PRIVATE_TOKEN in .env or your API credentials.`);
                    }
                }
                console.error('GraphQL API Error:', error);
                throw new Error('Failed to fetch data from Workflow API');
            }
        });
    }
    getAppWorkflows() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
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
            const data = yield this.fetchGraphQL(query);
            return ((_a = data === null || data === void 0 ? void 0 : data.getWorkflowsByAppID) === null || _a === void 0 ? void 0 : _a.map((workflow) => Object.assign(new workflow_app_model_1.WorkflowApp(), workflow))) || [];
        });
    }
    getUserPendingRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
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
            const data = yield this.fetchGraphQL(query);
            return ((_a = data === null || data === void 0 ? void 0 : data.getUserPendingWorkflowRequestApproval) === null || _a === void 0 ? void 0 : _a.map((req) => Object.assign(new workflow_app_request_model_1.WorkflowAppRequest(), req))) || [];
        });
    }
    getSingleWorkflowRequest(requestId) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const data = yield this.fetchGraphQL(query);
            return Object.assign(new workflow_app_request_model_1.WorkflowAppRequest(), (data === null || data === void 0 ? void 0 : data.workflowRequest) || {});
        });
    }
    workflowRequestByReferenceId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                operationName: 'workflowRequestById',
                variables: { id },
                query: `
            query workflowRequestById($id: String!) {
                workflowRequestById(id: $id) {
                id
                isCompleted
                isReceived
                requestId
                requestDetails
                }
            }
            `,
            };
            const data = yield this.fetchGraphQL(query);
            return Object.assign(new workflow_app_request_model_1.WorkflowAppRequest(), (data === null || data === void 0 ? void 0 : data.workflowRequestById) || {});
        });
    }
    createWorkflowRequest(userId_1, requestId_1, workflowId_1, requestDetails_1) {
        return __awaiter(this, arguments, void 0, function* (userId, requestId, workflowId, requestDetails, isEmployee = true) {
            var _a;
            const query = {
                operationName: 'createWorkflowRequest',
                variables: Object.assign({ createWorkflowRequestInput: {
                        appId: this.appId,
                        requestDetails,
                        requestId,
                        userId: isEmployee ? null : userId,
                        workflowId,
                    } }, (isEmployee !== undefined && { isEmployee })),
                query: `
        mutation createWorkflowRequest($createWorkflowRequestInput: CreateWorkflowRequestInput!, $isEmployee: Boolean) {
          createWorkflowRequest(createWorkflowRequestInput: $createWorkflowRequestInput, isEmployee: $isEmployee) {
            id
          }
        }
      `,
            };
            const data = yield this.fetchGraphQL(query);
            return ((_a = data === null || data === void 0 ? void 0 : data.createWorkflowRequest) === null || _a === void 0 ? void 0 : _a.id) || '';
        });
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
    getPendingActions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appRequests = yield this.getUserPendingRequests(userId);
                const actions = appRequests.map((req) => ({
                    description: 'Pending Approval',
                    count: 1,
                    link: `${process.env.APP_URL}/approvals/${req.requestId}`,
                }));
                return {
                    appName: 'PMS',
                    actions,
                };
            }
            catch (error) {
                console.error(error);
                throw new Error('Workflow Pending Actions Failed.');
            }
        });
    }
    workflowRequestTakeAction(workflowStepId, action, remarks, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                operationName: 'workflowRequestAction',
                variables: {
                    workflowStepId,
                    action,
                    remarks,
                    userId,
                },
                query: `
        mutation workflowRequestAction($workflowStepId: Int!, $action: Action!, $remarks: String!, $userId: String ) {
            workflowRequestAction(workflowStepId: $workflowStepId, action: $action, remarks: $remarks, userId: $userId) {
              id
              isCompleted
              isReceived
              requestId
              requestDetails
            }
          }
        `,
            };
            const data = yield this.fetchGraphQL(query);
            return Object.assign(new workflow_app_request_model_1.WorkflowAppRequest(), (data === null || data === void 0 ? void 0 : data.workflowRequestAction) || {});
        });
    }
    getToken() {
        try {
            const token = jwt.sign({ sub: this.appId, type: 'app' }, Buffer.from(this.privateToken, 'base64').toString('ascii'), { algorithm: 'RS256' });
            return token;
        }
        catch (error) {
            throw new Error(`JWT Signing Failed: Your WORKFLOW_API_PRIVATE_TOKEN is incorrect or not a valid private key.` +
                `\n Ensure your private key is Base64-encoded and correct.`);
        }
    }
}
exports.WorkflowAppService = WorkflowAppService;
//# sourceMappingURL=workflow-app.service.js.map