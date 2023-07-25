import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DeleteItemCommand, PutItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 } from "uuid";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import dynamoDBClient from "./dynamoDBClient";
import { fetchProductById, handleError, productSchema } from "./utils";

const productTable = process.env.PRODUCTS_TABLE;
const headers = {
  "content-type": "application/json",
};

export const createProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const reqBody = JSON.parse(event.body as string);

  const product = {
    ...reqBody,
    productID: v4(),
  };

  await dynamoDBClient.send(
    new PutItemCommand({
      TableName: productTable,
      Item: marshall(product),
    }),
  );

  return {
    statusCode: 201,
    body: JSON.stringify({ product }),
  };
};

export const getProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const product = await fetchProductById(event.pathParameters?.id as string);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(unmarshall(product)),
    };
  } catch (e) {
    return handleError(e);
  }
};

export const updateProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id as string;

    await fetchProductById(id);

    const reqBody = JSON.parse(event.body as string);

    const parsedData = productSchema.parse(reqBody);

    const updatedProduct = {
      ...parsedData,
      productID: id,
    };

    await dynamoDBClient.send(
      new UpdateItemCommand({
        TableName: productTable,
        Key: { productID: { S: id } },
        UpdateExpression: "SET #name = :name, #description = :description, #price = :price, #available = :available",
        ExpressionAttributeNames: {
          "#name": "name",
          "#description": "description",
          "#price": "price",
          "#available": "available",
        },
        ExpressionAttributeValues: {
          ":name": { S: updatedProduct.name },
          ":price": { S: updatedProduct.price.toString() },
          ":description": { S: updatedProduct.description },
          ":available": { BOOL: updatedProduct.available },
        },
      }),
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updatedProduct),
    };
  } catch (e) {
    return handleError(e);
  }
};

export const deleteProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id as string;

    await fetchProductById(id);

    await dynamoDBClient.send(
      new DeleteItemCommand({
        TableName: productTable,
        Key: marshall({ productID: id }, { removeUndefinedValues: true }),
      }),
    );

    return {
      statusCode: 204,
      body: `Delete product successfully with id as ${id}`,
    };
  } catch (e) {
    return handleError(e);
  }
};

export const listProducts = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const productTable = process.env.PRODUCTS_TABLE;

  try {
    const output = await dynamoDBClient.send(
      new ScanCommand({
        TableName: productTable,
      }),
    );

    const items = output.Items ? output.Items.map((item) => unmarshall(item)) : [];

    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
