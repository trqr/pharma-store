export type Product = {
    id : number,
    productId : number,
    cis : number,
    name : string,
    price : number | null,
    genericGroup : number | null,
    activeSubstances : string,
    description : string,
    isEnabled : boolean | null,
    promotionPrice : number | null,
    quantity : number | null,
}