export class Response<T> {
  data: T;
  error: string;
  message?: string;
  status: number;
  meta?: any;
  public static success<T>(data: T, meta?: any): Response<T> {
    return {
      data,
      error: "",
      message: "Success",
      status: 200,
      meta,
    };
  }
  public static error<T>(error: string, status: number): Response<T> {
    return {
      data: null,
      error,
      message: "Error",
      status,
    };
  }
}
