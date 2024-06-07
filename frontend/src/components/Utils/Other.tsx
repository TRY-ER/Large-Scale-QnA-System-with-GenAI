
export const Array2Dict = (Array:Array<any>) => {
    const dictionary = Array.reduce((acc, item) => {
        acc[item.Name] = item.Value;
        return acc;
    }, {});
    return dictionary;
}
