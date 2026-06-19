import { NextResponse } from "next/server";

export interface ApiResponseBody<T = unknown> {
  code: number;
  status: string;
  message: string;
  body?: T;
}

export function success<T>(data?: T, message = "success") {
  const body: ApiResponseBody<T> = {
    code: 200,
    status: "success",
    message,
    body: data,
  };
  return NextResponse.json(body);
}

export function fail(message: string, status: number = 400) {
  const body: ApiResponseBody = {
    code: status,
    status: "error",
    message,
  };
  return NextResponse.json(body, { status });
}
