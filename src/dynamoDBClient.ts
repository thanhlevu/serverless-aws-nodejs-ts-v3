import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

const dynamoDBConfig: DynamoDBClientConfig = { region: process.env.REGION };
const dynamoDBClient = new DynamoDBClient(dynamoDBConfig);

export default dynamoDBClient;
