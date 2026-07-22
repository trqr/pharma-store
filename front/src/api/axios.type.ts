export type AxiosResponse<T> = { data: T }

export type ApiError = {
    type: string;
    title: string;
    status: number;
    detail: string;
    class: string;
    trace: unknown[];
};