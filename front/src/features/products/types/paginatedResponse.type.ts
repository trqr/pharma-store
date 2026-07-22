import type { Product } from "./product.type"

export type PaginatedResponse = {
    data: Product[],
    pagination: 
    {
        page: number,
        limit: number,
        totalProducts: number,
        pages: number
    }
}

export const emptyPaginedRes : PaginatedResponse = {
    data: [],
    pagination: 
    {
        page: 0,
        limit: 0,
        totalProducts: 0,
        pages: 0
    }
}