import { Document } from 'mongoose';
export type RoutingDocument = Routing & Document;
export declare class Routing {
    warehouseId: number;
    state: string;
    address: string;
}
export declare const RoutingSchema: import("mongoose").Schema<Routing, import("mongoose").Model<Routing, any, any, any, Document<unknown, any, Routing, any, {}> & Routing & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Routing, Document<unknown, {}, import("mongoose").FlatRecord<Routing>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Routing> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
