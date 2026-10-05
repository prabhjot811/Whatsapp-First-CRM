export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiClient {
  constructor(private readonly baseUrl: string) {
    if (!baseUrl.trim()) {
      throw new Error("An API base URL is required.");
    }
  }

  async request<T>(
    path: string,
    decode: (value: unknown) => T,
    options: RequestOptions = {},
  ): Promise<T> {
    const response = await fetch(new URL(path, this.baseUrl), {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body === undefined
          ? {}
          : { "Content-Type": "application/json" }),
        ...options.headers,
      },
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new ApiError(
        details || `Request failed with status ${response.status}.`,
        response.status,
      );
    }

    if (response.status === 204) return decode(undefined);
    const payload: unknown = await response.json();
    return decode(payload);
  }
}
