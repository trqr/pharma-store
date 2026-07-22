import type {Product} from "../../products/types/product.type.ts";

export type CartItem = {
    id: number,
    product: Product,
    quantity: number
}