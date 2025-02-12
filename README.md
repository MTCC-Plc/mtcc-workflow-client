# 🚀 Internal Workflow App Client

---

## 📌 **Installation**

Since this package is hosted on **GitHub**, install it directly from the repository:

### **Using NPM**

````sh
npm install git+https://github.com/MTCC-Plc/mtcc-workflow-client.git

---

## 📂 **Setup**

Before using the package, **create a `.env` file** in your application and define the required environment variables:

```env
WORKFLOW_API_URL=https://dev-api-workflow.mtcc.com.mv/graphql
WORKFLOW_API_ID=12345
WORKFLOW_API_PRIVATE_TOKEN=your-private-token
````

Then, load environment variables at the start of your application:

```ts
import "dotenv/config";
import { WorkflowAppService } from "workflow-app-sdk";

const workflowService = new WorkflowAppService();
```

---

## 🔥 **Usage**

### **1️⃣ Fetch All Workflows**

```ts
async function fetchWorkflows() {
  try {
    const workflows = await workflowService.getAppWorkflows();
    console.log(workflows);
  } catch (error) {
    console.error("Error fetching workflows:", error);
  }
}

fetchWorkflows();
```

---

### **2️⃣ Get Pending Requests for a User**

```ts
async function fetchPendingRequests(userId: string) {
  try {
    const pendingRequests = await workflowService.getUserPendingRequests(
      userId
    );
    console.log(pendingRequests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
  }
}

fetchPendingRequests("user-123");
```

---

### **3️⃣ Get Single Workflow Request**

```ts
async function fetchSingleRequest(requestId: number) {
  try {
    const request = await workflowService.getSingleWorkflowRequest(requestId);
    console.log(request);
  } catch (error) {
    console.error("Error fetching workflow request:", error);
  }
}

fetchSingleRequest(101);
```

---

### **4️⃣ Create a Workflow Request**

```ts
async function createWorkflowRequest() {
  try {
    const requestId = await workflowService.createWorkflowRequest(
      "user-123",
      "456",
      789,
      "Workflow request details"
    );
    console.log("Created Workflow Request ID:", requestId);
  } catch (error) {
    console.error("Error creating workflow request:", error);
  }
}

createWorkflowRequest();
```

---

### **5️⃣ Cancel a Workflow Request**

```ts
async function cancelRequest() {
  try {
    const success = await workflowService.cancelWorkflowRequest(
      "456",
      "ProjectCreation"
    );
    console.log("Workflow request cancelled:", success);
  } catch (error) {
    console.error("Error cancelling workflow request:", error);
  }
}

cancelRequest();
```

---

### **6️⃣ Get Pending Actions for a User**

```ts
async function fetchPendingActions() {
  try {
    const actions = await workflowService.getPendingActions("user-123");
    console.log("Pending Actions:", actions);
  } catch (error) {
    console.error("Error fetching pending actions:", error);
  }
}

fetchPendingActions();
```

---

## 📜 **API Reference**

### 🏗 **WorkflowAppService Class**

#### **Constructor**

```ts
const workflowService = new WorkflowAppService();
```

🔹 **Loads API credentials from `process.env` variables.**  
🔹 **Throws an error if any required environment variable is missing.**

#### **Methods**

| Method                                                                                                 | Description                                       | Parameters                                      | Returns                         |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------- | ----------------------------------------------- | ------------------------------- |
| `getAppWorkflows()`                                                                                    | Fetches all workflows in the app.                 | None                                            | `Promise<WorkflowApp[]>`        |
| `getUserPendingRequests(userId: string)`                                                               | Fetches pending workflow requests for a user.     | `userId: string`                                | `Promise<WorkflowAppRequest[]>` |
| `getSingleWorkflowRequest(requestId: number)`                                                          | Retrieves details of a specific workflow request. | `requestId: number`                             | `Promise<WorkflowAppRequest>`   |
| `createWorkflowRequest(userId: string, requestId: string, workflowId: number, requestDetails: string)` | Creates a new workflow request.                   | `userId, requestId, workflowId, requestDetails` | `Promise<string>`               |
| `cancelWorkflowRequest(requestId: string, type: ProjectWorkflowTypeEnum)`                              | Cancels a workflow request.                       | `requestId, type`                               | `Promise<boolean>`              |
| `getPendingActions(userId: string)`                                                                    | Fetches pending actions for a user.               | `userId: string`                                | `Promise<object>`               |

---

## 📌 **Environment Variables**

This package **does not load `.env` automatically**. The application using this package **must** load environment variables before instantiating `WorkflowAppService`.

| Variable                     | Description                                          |
| ---------------------------- | ---------------------------------------------------- |
| `WORKFLOW_API_URL`           | The base URL of the Workflow API (GraphQL endpoint). |
| `WORKFLOW_API_ID`            | The application ID for API authentication.           |
| `WORKFLOW_API_PRIVATE_TOKEN` | The private API token for JWT authentication.        |

---
