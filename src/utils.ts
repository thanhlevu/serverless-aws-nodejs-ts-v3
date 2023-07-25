import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import dynamoDBClient from "./dynamoDBClient";
import { z, ZodError } from "zod";

const productTable = process.env.PRODUCTS_TABLE;

const headers = {
  "content-type": "application/json",
};

class HttpError extends Error {
  constructor(public statusCode: number, body: Record<string, unknown> = {}) {
    super(JSON.stringify(body));
  }
}

export const handleError = (e: unknown) => {
  if (e instanceof ZodError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        errors: e.errors,
      }),
    };
  }

  if (e instanceof SyntaxError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: `invalid request body format : "${e.message}"` }),
    };
  }

  if (e instanceof HttpError) {
    return {
      statusCode: e.statusCode,
      headers,
      body: e.message,
    };
  }

  throw e;
};

export const productSchema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  price: z.number().min(0, { message: "Price must be greater than or equal to 0" }),
  available: z.boolean().default(false),
});

export const fetchProductById = async (id: string) => {
  const output = await dynamoDBClient.send(
    new GetItemCommand({
      TableName: productTable,
      Key: marshall({
        productID: id,
      }),
    }),
  );

  if (!output.Item) {
    throw new HttpError(404, { error: "not found" });
  }

  return output.Item;
};
