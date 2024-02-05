export interface IApiResult {
  message?: string;
}

export interface IApiDataResult<TResponse> extends IApiResult {
  data: TResponse;
}
