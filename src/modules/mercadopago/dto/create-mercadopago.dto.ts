import { IsInt, IsPositive, IsUUID } from "class-validator"

class product {
    @IsUUID()
    id: string

    @IsInt()
    @IsPositive()
    quantity: number
}
export class CreateMercadopagoDto {
    products: product[]
    couponCode?: string
}
