export function assertIsDefined<T>(val : T) : asserts val is NonNullable<T>{
    if(!val){
        throw Error("'val' not defined, received "+val)
    }
}